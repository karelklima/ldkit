import { type Context, fromRdf, Graph, Iri, Node, type RDF } from "./rdf.ts";
import type { Property, Schema } from "./schema/mod.ts";
import ldkit from "./namespaces/ldkit.ts";
import rdf from "./namespaces/rdf.ts";

type DecodedNode = Record<string, unknown>;

class Decoder {
  private graph: Graph;
  private schema: Schema;
  private context: Context;

  private cache: Map<Schema, Map<Iri, DecodedNode>> = new Map();

  private constructor(graph: Graph, schema: Schema, context: Context) {
    this.graph = graph;
    this.schema = schema;
    this.context = context;
  }

  static decode(graph: Graph, schema: Schema, context: Context) {
    return new Decoder(graph, schema, context).decode();
  }

  getCachedNode(nodeIri: Iri, schema: Schema) {
    if (!this.cache.has(schema)) {
      this.cache.set(schema, new Map());
    }
    return this.cache.get(schema)!.get(nodeIri);
  }

  setCachedNode(nodeIri: Iri, schema: Schema, decodedNode: DecodedNode) {
    if (!this.cache.has(schema)) {
      this.cache.set(schema, new Map());
    }
    this.cache.get(schema)!.set(nodeIri, decodedNode);
  }

  decode() {
    const output: DecodedNode[] = [];

    for (const [iri, properties] of this.graph) {
      if (properties.has(rdf.type)) {
        const types = properties.get(rdf.type)!;
        for (const type of types) {
          if (type.termType === "NamedNode" && type.value === ldkit.Resource) {
            output.push(this.decodeNode(iri, this.schema));
          }
        }
      }
    }

    if (this.graph.size > 0 && output.length < 1) {
      throw new Error(
        `Unable to decode graph - no resources with type <${ldkit.Resource}> found`,
      );
    }

    return output;
  }

  decodeNode(nodeIri: Iri, schema: Schema) {
    const cachedNode = this.getCachedNode(nodeIri, schema);
    if (cachedNode) {
      return cachedNode;
    }

    const output: DecodedNode = {
      $id: nodeIri,
    };

    const node = this.graph.get(nodeIri);

    if (!node) {
      throw new Error(`Error decoding graph, <${nodeIri}> node not found.`);
    }

    output.$type = this.decodeNodeType(node);

    Object.keys(schema).forEach((key) => {
      if (key === "@type") {
        return;
      }
      const result = this.decodeNodeProperty(
        nodeIri,
        node,
        key,
        schema[key] as Property,
      );
      if (result !== undefined) {
        output[key] = result;
      }
    });

    this.setCachedNode(nodeIri, schema, output);

    return output;
  }

  decodeNodeType(node: Node) {
    const typeTerms = node.get(rdf.type);
    if (!typeTerms) {
      return [];
    }
    return typeTerms.reduce((acc, term) => {
      if (term.value !== ldkit.Resource) {
        acc.push(term.value);
      }
      return acc;
    }, [] as Iri[]);
  }

  decodeNodeProperty(
    nodeIri: Iri,
    node: Node,
    propertyKey: string,
    property: Property,
  ) {
    const terms = node.get(property["@id"]);

    if (!terms) {
      if (!property["@optional"]) {
        // No data, required property
        throw new Error(
          `Required property "${propertyKey}" of type <${
            property["@id"]
          }> not found on resource <${nodeIri}>`,
        );
      } else {
        // No data, optional property
        return property["@array"] ? [] : undefined;
      }
    }

    if (property["@multilang"]) {
      if (property["@array"]) {
        return terms.reduce((acc, term) => {
          if (term.termType !== "Literal") {
            throw new Error(
              `Property "${propertyKey}" data type mismatch - expected a literal, but received ${term.termType} instead on resource <${nodeIri}>`,
            );
          }
          const language = term.language;
          if (!acc[language]) {
            acc[language] = [];
          }
          acc[language].push(this.decodeTerm(term));
          return acc;
        }, {} as Record<string, string[]>);
      } else {
        return terms.reduce((acc, term) => {
          if (term.termType !== "Literal") {
            throw new Error(
              `Property "${propertyKey}" data type mismatch - expected a literal, but received ${term.termType} instead on resource <${nodeIri}>`,
            );
          }
          const language = term.language;
          if (!acc[language]) {
            // If there are multiple strings with the same language detected, selecting only the first one
            acc[language] = this.decodeTerm(term);
          }
          return acc;
        }, {} as Record<string, string>);
      }
    }

    if (property["@array"]) {
      if (property["@context"]) {
        // Collection of resources specified by sub schema
        return terms.map((term) => {
          if (term.termType !== "NamedNode" && term.termType !== "BlankNode") {
            throw new Error(
              `Property "${propertyKey}" data type mismatch - expected a node, but received ${term.termType} instead on resource <${nodeIri}>`,
            );
          }
          return this.decodeNode(term.value, property["@context"]!);
        });
      } else {
        // Collection of literals or named nodes
        return terms.map((term) => {
          if (term.termType !== "Literal" && term.termType !== "NamedNode") {
            throw new Error(
              `Property "${propertyKey}" data type mismatch - expected a literal or named node, but received ${term.termType} instead on resource <${nodeIri}>`,
            );
          }
          return this.decodeTerm(term);
        });
      }
    }

    // Single return value expected from this point on
    if (property["@context"]) {
      for (const term of terms) {
        if (term.termType === "NamedNode" || term.termType === "BlankNode") {
          return this.decodeNode(term.value, property["@context"]!);
        }
      }
      throw new Error(
        `Property "${propertyKey}" data type mismatch - expected a named node for context on resource <${nodeIri}>`,
      );
    }

    const preferredLanguage = this.context.language;

    if (preferredLanguage) {
      // Try to find a term that corresponds to the preferred language
      for (const term of terms) {
        if (
          term.termType === "Literal" &&
          term.language === preferredLanguage
        ) {
          return this.decodeTerm(term);
        }
      }
    }

    // All options exhausted - return first namedNode or literal if there are multiple
    for (const term of terms) {
      if (term.termType === "Literal" || term.termType === "NamedNode") {
        return this.decodeTerm(term);
      }
    }

    throw new Error(
      `Property "${propertyKey}" data type mismatch - expected a literal or named node instead on resource <${nodeIri}>`,
    );
  }

  decodeTerm(term: RDF.Term) {
    if (term.termType === "NamedNode") {
      return term.value;
    } else if (term.termType === "Literal") {
      return fromRdf(term);
    } else {
      throw new Error(`Unsupported term type to resolve: ${term.termType}`);
    }
  }
}

export const decode = (
  graph: Graph,
  schema: Schema,
  context: Context,
) => {
  return Decoder.decode(graph, schema, context);
};
