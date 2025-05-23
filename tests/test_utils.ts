import { assertEquals, Comunica } from "./test_deps.ts";

const NOLOG = Deno.args.includes("--nolog");
export const logQuery = NOLOG ? () => {} : console.log;

import { DataFactory, N3, type RDF } from "ldkit/rdf";
import { ldkit, schema, xsd } from "ldkit/namespaces";
import { Options, type QueryContext } from "ldkit";

import { Graph } from "../library/rdf.ts";

export type Equals<A, B> = A extends B ? (B extends A ? true : false) : false;

const X_NAMESPACE = "http://x/";

const dataFactory = new DataFactory();

const comunica = new Comunica();

export const x = new Proxy(
  {},
  {
    get: function (_target, prop, _receiver) {
      return `${X_NAMESPACE}${String(prop)}`;
    },
  },
) as Record<string, string>;

// Helper data factory wrapper compatible with N3
export const DF = () => {
  const df = new DataFactory({
    blankNodePrefix: "b",
  });

  return {
    namedNode: df.namedNode.bind(df),
    blankNode: df.blankNode.bind(df),
    literal: df.literal.bind(df),
    variable: df.variable.bind(df),
    quad: df.quad.bind(df),
    defaultGraph: df.defaultGraph.bind(df),
    fromTerm: df.fromTerm.bind(df),
    fromQuad: df.fromQuad.bind(df),
  };
};

const escapePseudoVariables = (turtle: string) => {
  return turtle.replace(/\?/g, "_:");
};

const convertPseudoVariable = <T extends RDF.Term>(term: T) => {
  const match = term.value.match(/v[0-9]+/);
  if (term.termType === "BlankNode" && match) {
    return dataFactory.variable(match[0]);
  }
  return term;
};

const convertPseudoVariables = (q: RDF.Quad) => {
  return dataFactory.quad(
    convertPseudoVariable(q.subject),
    convertPseudoVariable(q.predicate),
    convertPseudoVariable(q.object),
    dataFactory.defaultGraph(),
  );
};

export const ttl = (turtle: string) => {
  const prefixedTurtle = `
    @prefix x: <${X_NAMESPACE}> .
    @prefix ${ldkit.$prefix} <${ldkit.$iri}> .
    @prefix ${xsd.$prefix} <${xsd.$iri}> .
    @prefix ${schema.$prefix} <${schema.$iri}> .
  
    ${turtle}`;

  const escapedTurtle = escapePseudoVariables(prefixedTurtle);
  const df = DF();
  const escapedQuads = new N3.Parser({
    factory: df,
  }).parse(escapedTurtle);
  const quads = escapedQuads.map(convertPseudoVariables);
  return quads;
};

export const quadsToGraphSync = (quads: Iterable<RDF.Quad>) => {
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

export const createGraph = (turtle: string) => {
  const quads = ttl(turtle);
  return quadsToGraphSync(quads);
};

export const createStore = () =>
  new N3.Store(undefined, {
    factory: DF(),
  });

export const createStoreContext = (
  store: N3.Store,
  context?: QueryContext,
) => ({
  ...context,
  sources: [store],
} as QueryContext);

export const emptyStore = (store: N3.Store) => {
  const stream = store.removeMatches(null, null, null, null);
  return new Promise((resolve) => {
    stream.on("end", resolve);
  });
};

export const initStore = () => {
  const store = createStore();
  const context = createStoreContext(store);
  const assertStore = (turtle: string) => {
    const storeQuads = store.getQuads(null, null, null, null);
    const expectedQuads = ttl(turtle);
    assertEquals(storeQuads as RDF.Quad[], expectedQuads);
  };
  const empty = async () => {
    await emptyStore(store);
  };
  const setStore = async (turtle: string) => {
    await empty();
    const content = ttl(turtle);
    store.addQuads(content);
  };
  const options: Options = {
    engine: comunica,
    logQuery,
    ...context,
  };
  return { store, context, assertStore, empty, setStore, options };
};
