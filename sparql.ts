/**
 * SPARQL builders that provide a fluent interface for building SPARQL queries
 *
 * @example
 * ```typescript
 * import { SELECT } from "ldkit/sparql";
 *
 * const query = SELECT`?s ?p ?o`.WHERE`?s ?p ?o`.LIMIT(10).build();
 * console.log(query); // SELECT ?s ?p ?o WHERE { ?s ?p ?o } LIMIT 10;
 * ```
 *
 * @module
 */
export * from "./library/sparql/mod.ts";
