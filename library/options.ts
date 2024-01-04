import type { IQueryEngine, QueryContext } from "./rdf.ts";
import { QueryEngine } from "./engine/mod.ts";

type LDkitOptions = {
  engine: IQueryEngine;
  language: string;
  take: number;
  logQuery: (query: string) => void;
};

export type Options = Partial<LDkitOptions> & Partial<QueryContext>;

const defaultOptions = {
  engine: new QueryEngine(),
  take: 1000,
  logQuery: () => {},
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
