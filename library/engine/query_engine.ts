import {
  BindingsFactory,
  type Context,
  type IQueryEngine,
  QuadFactory,
  type RDF,
  RDFJSON,
} from "../rdf.ts";
import {
  ArrayIterator,
  MappingIterator,
} from "https://esm.sh/v94/asynciterator@3.7.0";

export class QueryEngine implements IQueryEngine {
  protected getSparqlEndpoint(context?: Context) {
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

  protected getFetch(context?: Context) {
    return context && context.fetch ? context.fetch : fetch;
  }

  async query(query: string, context?: Context) {
    const endpoint = this.getSparqlEndpoint(context);
    const fetchFn = this.getFetch(context);
    return await fetchFn(endpoint, {
      method: "POST",
      headers: {
        "accept": "application/sparql-results+json",
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      },
      body: new URLSearchParams({
        query,
      }),
    });
  }

  async queryBindings(
    query: string,
    context?: Context,
  ): Promise<RDF.ResultStream<RDF.Bindings>> {
    const result = await this.query(query, context);
    const json = await result.json();

    if (!Array.isArray(json?.results?.bindings)) {
      throw new Error("Bindings SPARQL query result not found");
    }

    const bindingsFactory = new BindingsFactory();

    const bindingsIterator = new ArrayIterator<RDFJSON.Bindings>(
      json.results.bindings,
    );

    // TODO: review the unknown type cast
    return new MappingIterator(
      bindingsIterator,
      (i) => bindingsFactory.fromJson(i),
    ) as unknown as RDF.ResultStream<RDF.Bindings>;
  }

  async queryBoolean(
    query: string,
    context?: Context,
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
    context?: Context,
  ): Promise<RDF.ResultStream<RDF.Quad>> {
    const result = await this.query(query, context);
    const json = await result.json();

    if (!Array.isArray(json?.results?.bindings)) {
      throw new Error("Quads SPARQL query result not found");
    }

    const quadFactory = new QuadFactory();

    const bindingsIterator = new ArrayIterator<RDFJSON.Bindings>(
      json.results.bindings,
    );

    // TODO: review the unknown type cast
    return new MappingIterator(
      bindingsIterator,
      (i) => quadFactory.fromJson(i),
    ) as unknown as RDF.ResultStream<RDF.Quad>;
  }

  async queryVoid(
    query: string,
    context?: Context,
  ): Promise<void> {
    await this.query(query, context);
  }
}
