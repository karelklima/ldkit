import { QueryEngine } from "https://esm.sh/@comunica/query-sparql";

import { from, map, switchMap } from "./rxjs.ts";

import { Context, resolveContext } from "./context.ts";
import { type Bindings, type Quad, quadsToGraph } from "./rdf.ts";

const engine = new QueryEngine();

export const booleanQuery = (query: string, context?: Context) =>
  from(engine.queryBoolean(query, resolveContext(context)));

export const bindingsQuery = (query: string, context?: Context) =>
  from(engine.queryBindings(query, resolveContext(context))).pipe(
    switchMap((stream) =>
      from((stream as any).toArray() as Promise<Bindings[]>)
    ),
  );

export const quadsQuery = (query: string, context?: Context) =>
  from(engine.queryQuads(query, resolveContext(context))).pipe(
    switchMap((stream) => from((stream as any).toArray() as Promise<Quad[]>)),
    map((quads) => quadsToGraph(quads)),
  );

export const updateQuery = (query: string, context?: Context) =>
  from(engine.queryVoid(query, resolveContext(context)));
