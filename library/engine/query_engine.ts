import { type RDF } from "../rdf.ts";

import { type IQueryEngine, type QueryContext } from "./types.ts";
import {
  getResponseTypes,
  resolve,
  type ResolverType,
} from "./query_resolvers.ts";

/**
 * A query engine that can query a SPARQL endpoint.
 *
 * Implements {@link IQueryEngine} interface.
 *
 * This engine is used by default if no other engine is configured.
 * See {@link Options} for more details.
 *
 * If you need to query other data sources, or multiple SPARQL endpoints,
 * you can use [Comunica](https://comunica.dev) instead, extend this engine,
 * or implement your own.
 */
export class QueryEngine implements IQueryEngine {
  protected getSparqlEndpoint(context?: QueryContext): string {
    if (!context) {
      throw new Error(
        "No context supplied to QueryEngine. You need to create a default context or pass one to a resource.",
      );
    }
    if (!Array.isArray(context.sources) || context.sources.length < 1) {
      throw new Error(
        "Invalid context `sources` attribute defined. You need to provide a URL to a SPARQL endpoint to query.",
      );
    }
    if (context.sources.length > 1) {
      throw new Error(
        "This query engine supports only one data source, multiple defined in `sources` property in context.",
      );
    }
    const source = context.sources[0];
    if (typeof source === "string") {
      return source;
    }
    if ("value" in source && typeof source.value === "string") {
      if ("type" in source) {
        if (source.type === "sparql") {
          return source.value;
        }
      } else {
        return source.value;
      }
    }
    throw new Error(
      "Invalid SPARQL source defined - please provide URL to a SPARQL endpoint to query.",
    );
  }

  protected getFetch(context?: QueryContext): typeof fetch {
    return context && context.fetch ? context.fetch : fetch;
  }

  protected query(
    body: { query: string } | { update: string },
    responseType: string,
    context?: QueryContext,
  ): Promise<Response> {
    const endpoint = this.getSparqlEndpoint(context);
    const fetchFn = this.getFetch(context);
    return fetchFn(endpoint, {
      method: "POST",
      headers: {
        "accept": responseType,
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      },
      body: new URLSearchParams(body),
    });
  }

  protected async queryAndResolve<T extends ResolverType>(
    type: T,
    query: string,
    context?: QueryContext,
  ) {
    const responseType = getResponseTypes(type).join(", ");
    const response = await this.query(
      { query },
      responseType,
      context,
    );

    if (!response.ok) {
      await response.body?.cancel();
      throw new Error(
        `Invalid query response status '${response.status} ${response.statusText}'`,
      );
    }

    return resolve(type, response);
  }

  /**
   * Executes a SPARQL SELECT query and returns a stream of bindings.
   *
   * @param query SPARQL query string
   * @param context Engine context
   * @returns Stream of bindings
   */
  public queryBindings(
    query: string,
    context?: QueryContext,
  ): Promise<RDF.ResultStream<RDF.Bindings>> {
    return this.queryAndResolve("bindings", query, context);
  }

  /**
   * Executes a SPARQL ASK query and returns a boolean result.
   *
   * @param query SPARQL query string
   * @param context Engine context
   * @returns Boolean result
   */
  public queryBoolean(
    query: string,
    context?: QueryContext,
  ): Promise<boolean> {
    return this.queryAndResolve("boolean", query, context);
  }

  /**
   * Executes a SPARQL CONSTRUCT query and returns a stream of quads.
   *
   * @param query SPARQL query string
   * @param context Engine context
   * @returns Stream of quads
   */
  queryQuads(
    query: string,
    context?: QueryContext,
  ): Promise<RDF.ResultStream<RDF.Quad>> {
    return this.queryAndResolve("quads", query, context);
  }

  /**
   * Executes a SPARQL UPDATE query and returns nothing.
   *
   * @param query SPARQL query string
   * @param context Engine context
   * @returns Nothing
   */
  async queryVoid(
    query: string,
    context?: QueryContext,
  ): Promise<void> {
    await this.query(
      { update: query },
      "application/sparql-results+json",
      context,
    );
  }
}
