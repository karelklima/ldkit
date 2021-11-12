import type { Context } from "@ldkit/context";
import { fromRdf, Graph, Iri, Node, Term } from "@ldkit/rdf";
import type { Schema, Property } from "@ldkit/schema";
import { ldkit, rdf, xsd } from "@ldkit/namespaces";

const DEFAULT_TYPE = xsd.string;

class Decoder {
  private graph: Graph;
  private schema: Schema;
  private context: Context;

  private cache: Map<Schema, Map<Iri, any>> = new Map();

  private constructor(graph: Graph, schema: Schema, context: Context) {
    this.graph = graph;
    this.schema = schema;
    this.context = context;
  }

  static decode(graph: Graph, schema: Schema, context: Context) {
    return new Decoder(graph, schema, context).decode();
  }

  decode() {
    const output: Record<string, any>[] = [];

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

    return output;
  }

  decodeNode(nodeIri: Iri, schema: Schema) {
    const output: Record<string, any> = {
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
        schema[key] as Property
      );
      if (result !== undefined) {
        output[key] = result;
      }
    });

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
    property: Property
  ) {
    const terms = node.get(property["@id"]);

    if (!terms) {
      if (!property["@optional"]) {
        // No data, required property
        throw new Error(
          `Required property "${propertyKey}" of type <${property["@id"]}> not found on resource <${nodeIri}>`
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
              `Property "${propertyKey}" data type mismatch - expected a literal, but received ${term.termType} instead on resource <${nodeIri}>`
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
              `Property "${propertyKey}" data type mismatch - expected a literal, but received ${term.termType} instead on resource <${nodeIri}>`
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
              `Property "${propertyKey}" data type mismatch - expected a node, but received ${term.termType} instead on resource <${nodeIri}>`
            );
          }
          return this.decodeNode(term.value, property["@context"]!);
        });
      } else {
        // Collection of literals or named nodes
        return terms.map((term) => {
          if (term.termType !== "Literal" && term.termType !== "NamedNode") {
            throw new Error(
              `Property "${propertyKey}" data type mismatch - expected a literal or named node, but received ${term.termType} instead on resource <${nodeIri}>`
            );
          }
          return this.decodeTerm(term);
        });
      }
    }

    // Single return value expected
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
      `Property "${propertyKey}" data type mismatch - expected a literal or named node instead on resource <${nodeIri}>`
    );
  }

  decodeTerm(term: Term) {
    if (term.termType === "NamedNode") {
      return term.value;
    } else if (term.termType === "Literal") {
      return fromRdf(term);
    } else {
      throw new Error(`Unsupported term type to resolve: ${term.termType}`);
    }
  }
}

export const decode = (graph: Graph, schema: Schema, context: Context) => {
  return Decoder.decode(graph, schema, context);
};
