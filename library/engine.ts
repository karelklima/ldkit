import { QueryEngine } from "https://esm.sh/@comunica/query-sparql@2.4.2?bundle";

import { from, map, switchMap } from "./rxjs.ts";

import { Context, resolveContext } from "./context.ts";
import { quadsToGraph } from "./rdf.ts";

const engine = new QueryEngine();

export const booleanQuery = (query: string, context?: Context) =>
  from(engine.queryBoolean(query, resolveContext(context)));

export const bindingsQuery = (query: string, context?: Context) =>
  from(engine.queryBindings(query, resolveContext(context))).pipe(
    switchMap((stream) => from(stream.toArray()))
  );

export const quadsQuery = (query: string, context?: Context) =>
  from(engine.queryQuads(query, resolveContext(context))).pipe(
    switchMap((stream) => from(stream.toArray())),
    map((quads) => quadsToGraph(quads))
  );

export const updateQuery = (query: string, context?: Context) =>
  from(engine.queryVoid(query, resolveContext(context)));
