import {
  type IQueryEngine,
  type QueryContext,
  QueryEngine,
} from "./engine/mod.ts";

export type Options = {
  engine?: IQueryEngine;
  language?: string;
  take?: number;
  logQuery?: (query: string) => void;
} & Partial<QueryContext>;

const defaultOptions = {
  engine: new QueryEngine(),
  take: 1000,
  logQuery: () => {},
};

let globalOptions: Options = {};

export function setGlobalOptions(options: Options): void {
  globalOptions = options;
}

export function resolveOptions(options: Options = {}) {
  return {
    ...defaultOptions,
    ...globalOptions,
    ...options,
  };
}

export function resolveQueryContext(options: Options): QueryContext {
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
}
