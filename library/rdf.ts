import type {
  Bindings,
  BlankNode,
  Literal,
  NamedNode,
  Quad,
  Term,
  Variable,
} from "https://esm.sh/rdf-js@4.0.2";
export type { Bindings, BlankNode, Literal, NamedNode, Quad, Term, Variable };

import type * as RDF from "https://esm.sh/rdf-js@4.0.2";

export type { RDF };

export { fromRdf, toRdf } from "https://esm.sh/rdf-literal@1.3.0";

import * as DataFactory from "https://esm.sh/rdf-data-factory@1.1.1";
export { DataFactory } from "https://esm.sh/rdf-data-factory@1.1.1";

export type Iri = string;

export type Node = Map<Iri, Term[]>;

export type Graph = Map<Iri, Node>;

export const namedNode = <Iri extends string = string>(
  value: Iri,
): NamedNode<Iri> => new DataFactory.NamedNode(value);

export const blankNode = (value: string) => new DataFactory.BlankNode(value);

export const literal = (
  value: string,
  languageOrDatatype?: string | NamedNode,
): Literal => new DataFactory.Literal(value, languageOrDatatype);

export const quad = (
  subject: Quad["subject"],
  predicate: Quad["predicate"],
  object: Quad["object"],
  graph?: Quad["graph"],
): Quad =>
  new DataFactory.Quad(
    subject,
    predicate,
    object,
    graph || DataFactory.DefaultGraph.INSTANCE,
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

export declare namespace RDFJSON {
  type Term = {
    type: "uri" | "literal" | "bnode";
    value: string;
    "xml:lang"?: string;
    datatype?: string;
  };
  type Bindings = Record<string, Term>;
}

//export type { RDFJSON };

/*type JsonTerm = {
  type: "uri" | "literal" | "bnode";
  value: string;
  "xml:lang"?: string;
  datatype?: string;
};
type JsonBindings = Record<string, JsonTerm>;*/
