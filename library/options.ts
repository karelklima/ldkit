import {
  type IQueryEngine,
  type QueryContext,
  QueryEngine,
} from "./engine/mod.ts";

/**
 * LDkit options and query engine context
 *
 * LDkit-specific options are:
 * - `engine` - a query engine to use for querying data sources
 * - `language` - a preferred language for literals
 * - `take` - a default number of results to take (limit of SELECT queries)
 * - `logQuery` - a function that will be called for each SPARQL query
 */
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
  distinctConstruct: true, // Needed for Comunica to filter duplicate quads on CONSTRUCT queries
};

let globalOptions: Options = {};

/**
 * Sets global configuration {@link Options} for LDkit that will be used
 * by default in all queries, unless overridden in {@link Lens}.
 *
 * LDkit-specific options are:
 * - `engine` - a query engine to use for querying data sources
 * - `language` - a preferred language for literals
 * - `take` - a default number of results to take (limit of SELECT queries)
 * - `logQuery` - a function that will be called for each SPARQL query
 *
 * Default values for these options are:
 * ```typescript
 * const defaultOptions = {
 *   engine: new QueryEngine(),
 *   take: 1000,
 *   logQuery: () => {},
 * };
 * ```
 * The default configuration uses built-in {@link QueryEngine}. Language is not set by default.
 *
 * @param options LDkit options and query engine context
 */
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
