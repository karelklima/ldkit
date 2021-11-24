import type {
  NamedNode,
  BlankNode,
  Literal,
  Variable,
  Quad,
  Term,
} from "rdf-js";
export type { NamedNode, BlankNode, Literal, Variable, Quad, Term };
import { fromRdf, toRdf } from "rdf-literal";
export { fromRdf, toRdf };
import * as DataFactory from "rdf-data-factory";
export { DataFactory } from "rdf-data-factory";

export type Iri = string;

export type Node = Map<Iri, Term[]>;

export type Graph = Map<Iri, Node>;

export const namedNode = <Iri extends string = string>(
  value: Iri
): NamedNode<Iri> => new DataFactory.NamedNode(value);

export const blankNode = (value: string) => new DataFactory.BlankNode(value);

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

export const quadsToGraph = (quads: Quad[]) => {
  const graph: Graph = new Map();
  for (const quad of quads) {
    const s = quad.subject.value;
    const p = quad.predicate.value;

    const predicateMap = graph.get(s) || graph.set(s, new Map()).get(s)!;
    const termArray = predicateMap.get(p) || predicateMap.set(p, []).get(p)!;

    termArray.push(quad.object);
  }
  return graph;
};
