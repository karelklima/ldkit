import { concat, lastValueFrom, Observable, take } from "https://esm.sh/rxjs";
import { Parser, Store } from "https://esm.sh/n3";

import { Context, createContext } from "../library/context.ts";
import {
  DataFactory,
  Quad,
  quad,
  quadsToGraph,
  Term,
  variable,
} from "../library/rdf.ts";
import { ldkit, schema, xsd } from "../library/namespaces/mod.ts";

export type Equals<A, B> = A extends B ? (B extends A ? true : false) : false;

const X_NAMESPACE = "http://x/";

// export const x = (s: string) => `${X_NAMESPACE}${s}`;

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

const convertPseudoVariable = <T extends Term>(term: T) => {
  const match = term.value.match(/v[0-9]+/);
  if (term.termType === "BlankNode" && match) {
    return variable(match[0]);
  }
  return term;
};

const convertPseudoVariables = (q: Quad) => {
  return quad(
    convertPseudoVariable(q.subject),
    convertPseudoVariable(q.predicate),
    convertPseudoVariable(q.object),
    convertPseudoVariable(q.graph),
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
  const escapedQuads = new Parser({ factory: df }).parse(escapedTurtle);
  const quads = escapedQuads.map(convertPseudoVariables);
  return quads;
};

export const createGraph = (turtle: string) => {
  const quads = ttl(turtle);
  return quadsToGraph(quads);
};

export const createStore = () =>
  new Store(undefined, {
    factory: DF(),
  });

export const createStoreContext = (store: Store, context?: Context) =>
  createContext({ ...context, sources: [store] });

export const emptyStore = async (store: Store) => {
  const stream = store.removeMatches(null, null, null, null);
  return new Promise((resolve) => {
    stream.on("end", resolve);
  });
};

export const run = <T>(...args: [...Observable<any>[], Observable<T>]) =>
  lastValueFrom<T>(
    concat(...args.map((obs: Observable<any>) => obs.pipe(take(1)))),
  );
