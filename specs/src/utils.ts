import { concat, lastValueFrom, Observable, take } from "rxjs";
import { Store, Parser } from "n3";

import { Context, createContext } from "@ldkit/context";
import type { Quad } from "@ldkit/rdf";
import { quadsToGraph } from "@ldkit/rdf";
import { ldkit, xsd, schema } from "@ldkit/namespaces";

export type Equals<A, B> = A extends B ? (B extends A ? true : false) : false;

const X_NAMESPACE = "http://x/";

// export const x = (s: string) => `${X_NAMESPACE}${s}`;

export const x = new Proxy(
  {},
  {
    get: function (_target, prop, _receiver) {
      return `${X_NAMESPACE}${String(prop)}`;
    },
  }
) as Record<string, string>;

const parser = new Parser();

export const ttl = (turtle: string) => {
  const prefixedTurtle = `
    @prefix x: <${X_NAMESPACE}> .
    @prefix ${ldkit.$prefix} <${ldkit.$iri}> .
    @prefix ${xsd.$prefix} <${xsd.$iri}> .
    @prefix ${schema.$prefix} <${schema.$iri}> .
  
    ${turtle}`;
  return parser.parse(prefixedTurtle);
};

export const createGraph = (turtle: string) => {
  const quads = ttl(turtle);
  return quadsToGraph(quads);
};

export const createStore = () => new Store();

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
    concat(...args.map((obs: Observable<any>) => obs.pipe(take(1))))
  );
