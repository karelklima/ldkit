import { type RDF } from "../rdf.ts";

import { type IQueryEngine, type QueryContext } from "./types.ts";
import {
  getResponseTypes,
  resolve,
  type ResolverType,
} from "./query_resolvers.ts";

export class QueryEngine implements IQueryEngine {
  protected getSparqlEndpoint(context?: QueryContext) {
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

  protected getFetch(context?: QueryContext) {
    return context && context.fetch ? context.fetch : fetch;
  }

  query(query: string, responseType: string, context?: QueryContext) {
    const endpoint = this.getSparqlEndpoint(context);
    const fetchFn = this.getFetch(context);
    return fetchFn(endpoint, {
      method: "POST",
      headers: {
        "accept": responseType,
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      },
      body: new URLSearchParams({
        query,
      }),
    });
  }

  async queryAndResolve<T extends ResolverType>(
    type: T,
    query: string,
    context?: QueryContext,
  ) {
    const responseType = getResponseTypes(type).join(", ");
    const response = await this.query(
      query,
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

  queryBindings(
    query: string,
    context?: QueryContext,
  ): Promise<RDF.ResultStream<RDF.Bindings>> {
    return this.queryAndResolve("bindings", query, context);
  }

  queryBoolean(
    query: string,
    context?: QueryContext,
  ): Promise<boolean> {
    return this.queryAndResolve("boolean", query, context);
  }

  queryQuads(
    query: string,
    context?: QueryContext,
  ): Promise<RDF.ResultStream<RDF.Quad>> {
    return this.queryAndResolve("quads", query, context);
  }

  async queryVoid(
    query: string,
    context?: QueryContext,
  ): Promise<void> {
    await this.query(query, "application/sparql-results+json", context);
  }
}
