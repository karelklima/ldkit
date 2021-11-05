import type { Iri } from "./iri";
import type { Property, Schema } from "@ldkit/schema";
import { fromRdf, Graph, NamedNode, Term } from "@ldkit/rdf";
import type { Context } from "@ldkit/context";

const DEFAULT_LANGUAGE = "en";

type EntityData = {
  schema: Schema;
  graph: Graph;
  pointer: Iri;
  context: Context;
};

const resolveTerm = (term: Term) => {
  if (term.termType === "NamedNode") {
    return term.value;
  } else if (term.termType === "Literal") {
    return fromRdf(term);
  } else {
    throw new Error(`Unsupported term type to resolve: ${term.termType}`);
  }
};

const proxyHandler = {
  get: (target: EntityData, propertyAlias: string): any => {
    const targetSchema = target.schema;
    const targetObject = target.graph[target.pointer];

    if (propertyAlias === "@id") {
      return target.pointer;
    }

    if (!targetSchema[propertyAlias]) {
      throw new Error(
        `Unknown property ${propertyAlias} in schema of ${targetSchema["@type"]}`
      );
    }
    const property = targetSchema[propertyAlias] as Property;

    const proxyValue = targetObject[property["@id"]];
    if (property["@context"]) {
      if (property["@meta"].includes("@array")) {
        // We have an array!
        if (!proxyValue) {
          return [];
        }
        return proxyValue.map((value) => {
          return new Proxy(
            {
              ...target,
              schema: property["@context"]!,
              pointer: (value as NamedNode).value,
            },
            proxyHandler
          );
        });
      } else {
        // Single value
        return new Proxy(
          {
            ...target,
            schema: property["@context"]!,
            pointer: (proxyValue[0] as NamedNode).value,
          },
          proxyHandler
        );
      }
    }
    if (!proxyValue) {
      // No triple within the subgraph exists with the property alias
      return null;
    }
    if (property["@meta"].includes("@array")) {
      return proxyValue.map(resolveTerm);
    } else {
      if (!Array.isArray(proxyValue)) {
        return resolveTerm(proxyValue);
      }

      // Multiple terms, but we need to pick only one of them

      const preferredLanguage = target.context.language ?? "en";
      const match = proxyValue.find(
        (value) =>
          value.termType === "Literal" &&
          value.language &&
          value.language === preferredLanguage
      );
      const result = match ?? proxyValue[0];
      return resolveTerm(result);
    }
  },
};

export const createProxy = (
  schema: Schema,
  graph: Graph,
  pointer: Iri,
  context: Context
) => {
  const target = {
    schema,
    graph,
    pointer,
    context,
  };
  return new Proxy(target, proxyHandler);
};
