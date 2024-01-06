import { createNamespace } from "./namespace.ts";

/**
 * LDkit Ontology
 *
 * `@ldkit: <http://ldkit.io/ontology/>`,
 */
export const ldkit = createNamespace(
  {
    iri: "https://ldkit.io/ontology/",
    prefix: "ldkit:",
    terms: ["Resource"],
  } as const,
);
