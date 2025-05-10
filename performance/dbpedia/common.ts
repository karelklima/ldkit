import { type Options, type QueryContext, QueryEngine } from "ldkit";
import { createNamespace } from "ldkit/namespaces";

export { createLens } from "ldkit";
export { dbo } from "ldkit/namespaces";

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
  override async query(
    body: string,
    requestType: "application/sparql-query" | "application/sparql-update",
    // deno-lint-ignore no-explicit-any
    responseType: any,
    context?: QueryContext,
  ) {
    console.log("Query: ", body);
    console.time("DBpedia first response time");
    const result = await super.query(body, requestType, responseType, context);
    console.timeEnd("DBpedia first response time");
    return result;
  }
}

export const options: Options = {
  engine: new LoggingQueryEngine(),
  sources: ["https://dbpedia.org/sparql"], // SPARQL endpoint
};
