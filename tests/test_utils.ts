import { N3 } from "./test_deps.ts";

import {
  type Context,
  DataFactory,
  quadsToGraph,
  type RDF,
} from "../library/rdf.ts";
import { ldkit, schema, xsd } from "../library/namespaces/mod.ts";

export type Equals<A, B> = A extends B ? (B extends A ? true : false) : false;

const X_NAMESPACE = "http://x/";

const dataFactory = new DataFactory();

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

export const createGraph = (turtle: string) => {
  const quads = ttl(turtle);
  return quadsToGraph(quads);
};

export const createStore = () =>
  new N3.Store(undefined, {
    factory: DF(),
  });

export const createStoreContext = (store: N3.Store, context?: Context) => ({
  ...context,
  sources: [store],
} as Context);

export const emptyStore = (store: N3.Store) => {
  const stream = store.removeMatches(null, null, null, null);
  return new Promise((resolve) => {
    stream.on("end", resolve);
  });
};
