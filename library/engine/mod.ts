//import { QueryEngine } from "https://esm.sh/@comunica/query-sparql@2.4.3";

import { QueryEngine } from "./query_engine.ts";

import { from, map, of, switchMap } from "../rxjs.ts";

import { Context, resolveContext } from "../context.ts";
import { type Bindings, type Quad, quadsToGraph } from "../rdf.ts";

const engine = new QueryEngine();

export const booleanQuery = (query: string, context?: Context) =>
  from(engine.queryBoolean(query, resolveContext(context)));

export const bindingsQuery = (query: string, context?: Context) =>
  from(engine.queryBindings(query, resolveContext(context))).pipe(
    switchMap((stream) => of(Array.from(stream as any) as Bindings[])),
  );

export const quadsQuery = (query: string, context?: Context) =>
  from(engine.queryQuads(query, resolveContext(context))).pipe(
    switchMap((stream) => of(Array.from(stream as any) as Quad[])),
    map((quads) => {
      return quadsToGraph(quads);
    }),
  );

export const updateQuery = (query: string, context?: Context) =>
  from(engine.queryVoid(query, resolveContext(context)));
