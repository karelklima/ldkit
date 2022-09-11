import type { RDF } from "../rdf.ts";

import type { Context } from "../context.ts";
import { jsonToBindingsFactory, jsonToQuadsFactory } from "./utils.ts";

export type QueryEngineContext = Context & RDF.QueryStringContext;

// deno-lint-ignore no-empty-interface
export interface QueryEngineType
  extends
    RDF.StringSparqlQueryable<RDF.SparqlResultSupport, QueryEngineContext> {
}

export class QueryEngine implements QueryEngineType {
  protected getSparqlEndpoint(context?: QueryEngineContext) {
    if (!context) {
      throw new Error(
        "No context supplied to QueryEngine. You need to create a default context or pass one to a resource.",
      );
    }
    if (!context.source || typeof context.source !== "string") {
      throw new Error(
        "No context source attribute defined. You need to provide a URL to a SPARQL endpoint to query.",
      );
    }
    return context.source;
  }

  protected getFetch(context?: QueryEngineContext) {
    return context && context.fetch ? context.fetch : fetch;
  }

  async query(query: string, context?: QueryEngineContext) {
    const endpoint = this.getSparqlEndpoint(context);
    const fetchFn = this.getFetch(context);
    return await fetchFn(endpoint, {
      method: "POST",
      body: query,
      headers: {
        "content-type": "application/sparql-query",
        "accept": "application/sparql-results+json",
      },
    });
  }

  async queryBindings(
    query: string,
    context?: QueryEngineContext,
  ): Promise<RDF.ResultStream<RDF.Bindings>> {
    const result = await this.query(query, context);
    const json = await result.json();

    if (!Array.isArray(json?.results?.bindings)) {
      throw new Error("Bindings SPARQL query result not found");
    }

    // Force richer type from RDF spec
    return Array.from(
      json.results.bindings,
      jsonToBindingsFactory(),
    ) as unknown as RDF.ResultStream<RDF.Bindings>;
  }

  async queryBoolean(
    query: string,
    context?: QueryEngineContext,
  ): Promise<boolean> {
    const result = await this.query(query, context);
    const json = await result.json();
    if ("boolean" in json) {
      return Boolean(json.boolean);
    }
    throw new Error("Boolean SPARQL query result not found");
  }

  async queryQuads(
    query: string,
    context?: QueryEngineContext,
  ): Promise<RDF.ResultStream<RDF.Quad>> {
    const result = await this.query(query, context);
    const json = await result.json();

    if (!Array.isArray(json?.results?.bindings)) {
      throw new Error("Quads SPARQL query result not found");
    }

    // Force richer type from RDF spec
    return Array.from(
      json.results.bindings,
      jsonToQuadsFactory(),
    ) as unknown as RDF.ResultStream<RDF.Quad>;
  }

  async queryVoid(
    query: string,
    context?: QueryEngineContext,
  ): Promise<void> {
    await this.query(query, context);
  }
}
