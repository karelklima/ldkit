import type { SchemaInterface } from "@ldkit/schema";
import type { Schema, Property } from "@ldkit/schema";
import { namedNode, quad, toRdf, Quad } from "@ldkit/rdf";
import type { Iri } from "./iri";
import { rdf, xsd } from "@ldkit/namespaces";

const convertProperty = (value: any, property: Property) => {
  return toRdf(value, { datatype: namedNode(property["@type"] || xsd.string) });
};

export const entityToRdf = (
  iri: Iri,
  entity: Record<string, any>,
  schema: Schema
) => {
  const result = new Array<Quad>();
  schema["@type"].forEach((type) => {
    result.push(quad(namedNode(iri), namedNode(rdf.type), namedNode(type)));
  });
  return Object.keys(entity).reduce((acc, key) => {
    const value = entity[key];
    const property = schema[key] as Property;
    const rdfValue = convertProperty(value, property);
    acc.push(quad(namedNode(iri), namedNode(property["@id"]), rdfValue));
    return acc;
  }, result);
};
