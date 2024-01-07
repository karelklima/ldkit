import type * as RDF from "npm:@rdfjs/types";

export type { RDF };

export { fromRdf, toRdf } from "npm:rdf-literal@1.3.1";

import { DataFactory, DefaultGraph } from "npm:rdf-data-factory@1.1.1";
export { DataFactory, DefaultGraph };

// @deno-types="npm:@types/n3"
export * as N3 from "npm:n3@1.17.2";

export type Iri = string;

export type Node = Map<Iri, RDF.Term[]>;

export type Graph = Map<Iri, Node>;

export const quadsToGraph = (quads: Iterable<RDF.Quad>) => {
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
    lang?: string;
    datatype?: string;
  };
  type Bindings = Record<string, Term>;
  type Triple = [Iri, Iri, Term];
  type SparqlResultsJsonFormat = {
    head: {
      vars?: string[];
    };
    results?: {
      bindings: Bindings[];
    };
    boolean?: boolean;
  };
  type RdfJsonFormat = Record<Iri, Record<Iri, Term[]>>;
  interface TermFactory {
    fromJson(jsonTerm: Term): RDF.Term;
  }
  interface BindingsFactory {
    fromJson(jsonBindings: Bindings): RDF.Bindings;
  }
  interface QuadFactory {
    fromJson(jsonRdf: Triple): RDF.Quad;
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
    if ("lang" in jsonTerm) {
      return this.dataFactory.literal(jsonTerm.value, jsonTerm["lang"]);
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

export class ReadOnlyBindings implements RDF.Bindings {
  public readonly type = "bindings";

  protected readonly dataFactory: RDF.DataFactory;
  protected readonly entries: Map<RDF.Variable, RDF.Term>;
  protected readonly variables: Map<string, RDF.Variable>;

  constructor(
    bindings: Map<RDF.Variable, RDF.Term>,
    dataFactory: RDF.DataFactory = new DataFactory(),
  ) {
    this.entries = bindings;
    this.dataFactory = dataFactory;
    this.variables = new Map();
    for (const variable of bindings.keys()) {
      this.variables.set(variable.value, variable);
    }
  }

  has(key: string | RDF.Variable) {
    const stringKey = typeof key === "string" ? key : key.value;
    const variableKey = this.variables.get(stringKey);
    return this.entries.has(variableKey!);
  }

  get(key: string | RDF.Variable) {
    const stringKey = typeof key === "string" ? key : key.value;
    const variableKey = this.variables.get(stringKey);
    return this.entries.get(variableKey!);
  }

  set(_key: string | RDF.Variable, _value: RDF.Term): RDF.Bindings {
    throw new Error("Method not implemented.");
  }

  delete(_key: string | RDF.Variable): RDF.Bindings {
    throw new Error("Method not implemented.");
  }

  keys() {
    return this.entries.keys();
  }

  values() {
    return this.entries.values();
  }

  forEach(fn: (value: RDF.Term, key: RDF.Variable) => unknown) {
    return this.entries.forEach(fn);
  }

  get size() {
    return this.entries.size;
  }

  [Symbol.iterator]() {
    return this.entries.entries();
  }

  equals(_other: RDF.Bindings | null | undefined): boolean {
    throw new Error("Method not implemented.");
  }

  filter(_fn: (value: RDF.Term, key: RDF.Variable) => boolean): RDF.Bindings {
    throw new Error("Method not implemented.");
  }

  map(_fn: (value: RDF.Term, key: RDF.Variable) => RDF.Term): RDF.Bindings {
    throw new Error("Method not implemented.");
  }

  merge(_other: RDF.Bindings): RDF.Bindings | undefined {
    throw new Error("Method not implemented.");
  }

  mergeWith(
    _merger: (self: RDF.Term, other: RDF.Term, key: RDF.Variable) => RDF.Term,
    _other: RDF.Bindings,
  ): RDF.Bindings {
    throw new Error("Method not implemented.");
  }
}

export class BindingsFactory implements RDFJSON.BindingsFactory {
  protected readonly dataFactory: RDF.DataFactory;
  protected readonly termFactory: RDFJSON.TermFactory;

  constructor(
    dataFactory: RDF.DataFactory = new DataFactory(),
    termFactory: RDFJSON.TermFactory = new TermFactory(dataFactory),
  ) {
    this.dataFactory = dataFactory;
    this.termFactory = termFactory;
  }

  fromJson(jsonBindings: RDFJSON.Bindings) {
    const bindingsEntries = Object.entries(jsonBindings).map((
      [varName, jsonTerm],
    ) => {
      return [
        this.dataFactory.variable!(varName),
        this.termFactory.fromJson(jsonTerm),
      ] as [RDF.Variable, RDF.Term];
    });
    return new ReadOnlyBindings(new Map(bindingsEntries), this.dataFactory);
  }
}

export class QuadFactory implements RDFJSON.QuadFactory {
  protected readonly dataFactory: RDF.DataFactory;
  protected readonly termFactory: RDFJSON.TermFactory;
  constructor(
    dataFactory: RDF.DataFactory = new DataFactory(),
    termFactory: RDFJSON.TermFactory = new TermFactory(dataFactory),
  ) {
    this.dataFactory = dataFactory;
    this.termFactory = termFactory;
  }

  fromJson(jsonRdf: [Iri, Iri, RDFJSON.Term]) {
    const [s, p, o] = jsonRdf;
    return this.dataFactory.quad(
      this.dataFactory.namedNode(s),
      this.dataFactory.namedNode(p),
      this.termFactory.fromJson(o) as RDF.Quad_Object,
    );
  }
}
