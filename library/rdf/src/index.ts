import type { NamedNode, Literal, Variable, Quad, Term } from "rdf-js";
export { NamedNode, Literal, Variable, Quad, Term };
import { fromRdf, toRdf } from "rdf-literal";
export { fromRdf, toRdf };
import * as DataFactory from "rdf-data-factory";

export type Graph = Record<string, Record<string, Term[]>>;

export const namedNode = <Iri extends string = string>(
  value: Iri
): NamedNode<Iri> => new DataFactory.NamedNode(value);

export const literal = (
  value: string,
  languageOrDatatype?: string | NamedNode
): Literal => new DataFactory.Literal(value, languageOrDatatype);

export const quad = (
  subject: Quad["subject"],
  predicate: Quad["predicate"],
  object: Quad["object"],
  graph?: Quad["graph"]
): Quad =>
  new DataFactory.Quad(
    subject,
    predicate,
    object,
    graph || DataFactory.DefaultGraph.INSTANCE
  ) as Quad;

export const variable = (value: string): Variable =>
  new DataFactory.Variable(value);
