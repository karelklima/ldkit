import { createNamespace } from "../library/namespace.ts";

/**
 * LDkit Ontology
 *
 * `@ldkit: <http://ldkit.io/ontology/>`,
 */
export const ldkit = createNamespace(
  {
    iri: "https://ldkit.io/ontology/",
    prefix: "ldkit:",
    terms: ["Resource", "IRI"],
  } as const,
);
