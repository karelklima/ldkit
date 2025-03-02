import type {
  IQueryContextCommon,
  QuerySourceUnidentified,
} from "npm:@comunica/types@^4.1.0";

import { RDF } from "../rdf.ts";

/**
 * A set of context entries that can be passed to a query engine,
 * such as data sources, fetch configuration, etc.
 *
 * @example
 * ```typescript
 * import { QueryContext, QueryEngine } from "ldkit";
 *
 * const context: QueryContext = {
 *   sources: ["https://dbpedia.org/sparql"],
 * };
 *
 * const engine = new QueryEngine();
 * await engine.queryBoolean("ASK { ?s ?p ?o }", context);
 * ```
 */
export type QueryContext =
  & RDF.QueryStringContext
  & RDF.QuerySourceContext<QuerySourceUnidentified>
  & IQueryContextCommon;

/**
 * Interface of a query engine compatible with LDkit
 */
export type IQueryEngine = RDF.StringSparqlQueryable<
  RDF.SparqlResultSupport,
  QueryContext
>;
