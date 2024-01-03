import type { IQueryEngine, QueryContext } from "./rdf.ts";
import { QueryEngine } from "./engine/mod.ts";

type LDkitOptions = {
  engine?: IQueryEngine;
  language?: string;
  take?: number;
};

export type Options = LDkitOptions & Partial<QueryContext>;

const defaultOptions = {
  engine: new QueryEngine(),
  take: 1000,
};

let globalOptions: Options = {};

export const setGlobalOptions = (options: Options) => {
  globalOptions = options;
};

export const resolveOptions = (options: Options = {}) => {
  return {
    ...defaultOptions,
    ...globalOptions,
    ...options,
  };
};

export const resolveQueryContext = (options: Options): QueryContext => {
  const { engine: _engine, language: _language, take: _take, ...context } =
    options;

  if (context.source !== undefined && context.sources === undefined) {
    context.sources = [context.source];
    delete context.source;
  }

  if (context.sources === undefined) {
    throw new Error("No data source defined in Options");
  }

  return context as QueryContext;
};

let defaultContext: QueryContext | undefined = undefined;
let defaultEngine: IQueryEngine | undefined = undefined;

export const setDefaultContext = (context: QueryContext) => {
  defaultContext = context;
};

export const resolveContext = (context?: QueryContext) => {
  if (!context && !defaultContext) {
    throw new Error(
      "No context found. Please create a default context or pass one to createLens function",
    );
  }
  return context || defaultContext!;
};

export const setDefaultEngine = (engine: IQueryEngine) => {
  defaultEngine = engine;
};

export const resolveEngine = (engine?: IQueryEngine) => {
  if (!engine && !defaultEngine) {
    setDefaultEngine(new QueryEngine());
    // TODO: consider the consequences here, maybe log a warning?
    /*throw new Error(
      "No engine found. Please create a default engine or pass one to createLens function",
    );*/
  }
  return engine || defaultEngine!;
};
