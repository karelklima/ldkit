import { type Context, DataFactory, type Iri, type RDF, toRdf } from "./rdf.ts";
import type { Property, Schema } from "./schema/mod.ts";
import xsd from "./namespaces/xsd.ts";
import rdf from "./namespaces/rdf.ts";

type DecodedNode = Record<string, unknown>;

type NodeId = RDF.NamedNode | RDF.BlankNode;

export const encode = (
  node: DecodedNode,
  schema: Schema,
  context: Context,
  variableInitCounter = 0,
) => {
  return Encoder.encode(node, schema, context, variableInitCounter);
};

class Encoder {
  private context: Context;

  private df: DataFactory = new DataFactory({
    blankNodePrefix: "b",
  });

  private variableCounter: number;

  private output: RDF.Quad[] = [];

  private constructor(context: Context, variableInitCounter: number) {
    this.context = context;
    this.variableCounter = variableInitCounter;
  }

  static encode(
    node: DecodedNode,
    schema: Schema,
    context: Context,
    variableInitCounter: number,
  ) {
    return new Encoder(context, variableInitCounter).encode(node, schema);
  }

  encode(node: DecodedNode, schema: Schema) {
    const nodeId = this.getNodeId(node);
    this.encodeNode(node, schema, nodeId);

    return this.output;
  }

  push(
    s: RDF.Quad_Subject,
    p: RDF.Quad_Predicate,
    o: RDF.Quad_Object,
  ) {
    this.output.push(this.df.quad(s, p, o));
  }

  getNodeId(node: DecodedNode) {
    return node.$id
      ? this.df.namedNode(node.$id as string)
      : this.df.blankNode();
  }

  getNodeTypes(node: DecodedNode) {
    if (Array.isArray(node.$type)) {
      return node.$type;
    }

    return node.$type ? [node.$type] : [];
  }

  encodeNode(node: DecodedNode, schema: Schema, nodeId: NodeId) {
    this.encodeNodeType(node, schema["@type"], nodeId);

    Object.keys(schema).forEach((key) => {
      if (key === "@type") {
        return;
      }
      this.encodeNodeProperty(node[key], schema[key] as Property, nodeId);
    });
  }

  encodeNodeType(node: DecodedNode, requiredTypes: Iri[], nodeId: NodeId) {
    const finalTypes = new Set([...this.getNodeTypes(node), ...requiredTypes]);

    finalTypes.forEach((type) => {
      this.push(nodeId, this.df.namedNode(rdf.type), this.df.namedNode(type));
    });
  }

  encodeNodeProperty(value: unknown, property: Property, nodeId: NodeId) {
    if (value === undefined) {
      return;
    }

    const propertyId = this.df.namedNode(property["@id"]);

    if (value === null) {
      // TODO
      this.push(
        nodeId,
        propertyId,
        this.df.variable(`v${this.variableCounter++}`),
      );
      return;
    }

    if (property["@multilang"]) {
      const multiValue = value as unknown as Record<string, unknown>;
      Object.keys(multiValue).forEach((language) => {
        const languageValue: string[] = Array.isArray(multiValue[language])
          ? multiValue[language] as string[]
          : [multiValue[language]] as string[];
        languageValue.forEach((singleValue) => {
          this.push(
            nodeId,
            propertyId,
            this.df.literal(
              singleValue,
              language.length > 0 ? language : undefined,
            ),
          );
        });
      });
      return;
    }

    const values = Array.isArray(value) ? value : [value];

    values.forEach((val) => {
      if (property["@context"]) {
        const subNodeId = this.getNodeId(val);
        this.encodeNode(val, property["@context"], subNodeId);
        this.push(nodeId, propertyId, subNodeId);
        return;
      }

      const propertyType = property["@type"] ? property["@type"] : xsd.string;

      if (typeof val === "string" && this.context.language) {
        if (propertyType === xsd.string || propertyType === rdf.langString) {
          this.push(
            nodeId,
            propertyId,
            this.df.literal(val, this.context.language),
          );
          return;
        }
      }

      const rdfValue = toRdf(val, {
        datatype: this.df.namedNode(propertyType),
      });
      this.push(nodeId, propertyId, rdfValue);
    });
  }
}
