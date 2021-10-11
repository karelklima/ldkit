import {
  newEngine,
  IQueryResultBoolean,
  IQueryResultBindings,
  IQueryResultQuads,
} from "@comunica/actor-init-sparql";
import type { IQueryResultUpdate } from "@comunica/actor-init-sparql/index-browser";
import { from, Observable } from "rxjs";
import { map, switchMap } from "rxjs/operators";

import { EngineContext, resolveContext } from "./context";
import { quadsToObject } from "./utils";

const engine = newEngine();

const queryEngine = (query: string, context?: EngineContext) =>
  from(engine.query(query, resolveContext(context)));

export const booleanQuery = (query: string, context?: EngineContext) =>
  (queryEngine(query, context) as Observable<IQueryResultBoolean>).pipe(
    switchMap((result) => from(result.booleanResult))
  );

export const bindingsQuery = (query: string, context?: EngineContext) =>
  (queryEngine(query, context) as Observable<IQueryResultBindings>).pipe(
    switchMap((result) => from(result.bindings()))
  );

export const quadsQuery = (query: string, context?: EngineContext) =>
  (queryEngine(query, context) as Observable<IQueryResultQuads>).pipe(
    switchMap((result) => from(result.quads())),
    map(quadsToObject)
  );

export const updateQuery = (query: string, context?: EngineContext) =>
  (queryEngine(query, context) as Observable<IQueryResultUpdate>).pipe(
    switchMap((result) => from(result.updateResult))
  );