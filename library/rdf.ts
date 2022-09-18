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

import { DataFactory } from "https://esm.sh/rdf-data-factory@1.1.1";
export { DataFactory };

import { BindingsFactory as ComunicaBindingsFactory } from "https://esm.sh/@comunica/bindings-factory@2.2.0";

import type {
  IDataSource,
  IQueryContextCommon,
} from "https://esm.sh/@comunica/types@2.4.0";

export type LDkitContext = {
  graph?: string;
  language?: string;
};

export type Context =
  & LDkitContext
  & RDF.QueryStringContext
  & RDF.QuerySourceContext<IDataSource>
  & IQueryContextCommon;

export type IQueryEngine = RDF.StringSparqlQueryable<
  RDF.SparqlResultSupport,
  Context
>;

export type Iri = string;

export type Node = Map<Iri, Term[]>;

export type Graph = Map<Iri, Node>;

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
  interface TermFactory {
    fromJson(jsonTerm: Term): RDF.Term;
  }
  interface BindingsFactory {
    fromJson(jsonBindings: Bindings): RDF.Bindings;
  }
  interface QuadFactory {
    fromJson(jsonBindings: Bindings): RDF.Quad;
  }
}

export class TermFactory implements RDFJSON.TermFactory {
  protected readonly dataFactory: RDF.DataFactory;
  constructor(dataFactory: RDF.DataFactory = new DataFactory()) {
    this.dataFactory = dataFactory;
  }

  fromJson(jsonTerm: RDFJSON.Term) {
    if (jsonTerm.type === "uri") {
      return this.dataFactory.namedNode(jsonTerm.value);
    }
    if (jsonTerm.type === "bnode") {
      return this.dataFactory.blankNode(jsonTerm.value);
    }
    if ("xml:lang" in jsonTerm) {
      return this.dataFactory.literal(jsonTerm.value, jsonTerm["xml:lang"]);
    }
    if ("datatype" in jsonTerm) {
      return this.dataFactory.literal(
        jsonTerm.value,
        this.dataFactory.namedNode(jsonTerm.datatype!),
      );
    }
    return this.dataFactory.literal(jsonTerm.value);
  }
}

export class BindingsFactory extends ComunicaBindingsFactory
  implements RDFJSON.BindingsFactory {
  protected readonly localDataFactory: RDF.DataFactory;
  protected readonly termFactory: RDFJSON.TermFactory;

  constructor(
    dataFactory: RDF.DataFactory = new DataFactory(),
    termFactory: RDFJSON.TermFactory = new TermFactory(),
  ) {
    super(dataFactory);
    this.localDataFactory = dataFactory;
    this.termFactory = termFactory;
  }

  fromJson(jsonBindings: RDFJSON.Bindings) {
    const bindingsEntries = Object.entries(jsonBindings).map((
      [varName, jsonTerm],
    ) => {
      return [
        this.localDataFactory.variable!(varName),
        this.termFactory.fromJson(jsonTerm),
      ] as [RDF.Variable, RDF.Term];
    });
    return this.bindings(bindingsEntries) as unknown as RDF.Bindings;
  }
}

export class QuadFactory implements RDFJSON.QuadFactory {
  protected readonly dataFactory: RDF.DataFactory;
  protected readonly bindingsFactory: RDFJSON.BindingsFactory;
  constructor(
    dataFactory: RDF.DataFactory = new DataFactory(),
    bindingsFactory: RDFJSON.BindingsFactory = new BindingsFactory(dataFactory),
  ) {
    this.dataFactory = dataFactory;
    this.bindingsFactory = bindingsFactory;
  }

  fromJson(jsonBindings: RDFJSON.Bindings) {
    const bindings = this.bindingsFactory.fromJson(jsonBindings);
    return this.dataFactory.quad(
      bindings.get("s") as RDF.Quad_Subject,
      bindings.get("p") as RDF.Quad_Predicate,
      bindings.get("o") as RDF.Quad_Object,
    );
  }
}
