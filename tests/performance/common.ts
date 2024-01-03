import { type QueryContext, QueryEngine } from "../../mod.ts";
import { createNamespace } from "../../namespaces.ts";

export { createLens } from "../../mod.ts";
export { dbo } from "../../namespaces.ts";

export const dbp = createNamespace(
  {
    iri: "http://dbpedia.org/property/",
    prefix: "dbp:",
    terms: [
      "title",
      "author",
      "country",
      "language",
      "genre",
    ],
  } as const,
);

class LoggingQueryEngine extends QueryEngine {
  async query(
    query: string,
    // deno-lint-ignore no-explicit-any
    responseType: any,
    context?: QueryContext,
  ) {
    console.log("Query: ", query);
    console.time("Query time");
    const result = await super.query(query, responseType, context);
    console.timeEnd("Query time");
    return result;
  }
}

export const engine = new LoggingQueryEngine();

// Create a context for query engine
export const context: QueryContext = {
  sources: ["https://dbpedia.org/sparql"], // SPARQL endpoint
};
