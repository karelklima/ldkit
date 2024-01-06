import { createNamespace } from "./namespace.ts";

/**
 * Dublin Core Metadata Element Set, Version 1.1
 *
 * `@dc: <http://purl.org/dc/elements/1.1/>`,
 */
export const dc = createNamespace(
  {
    iri: "http://purl.org/dc/elements/1.1/",
    prefix: "dc:",
    terms: [
      "contributor",
      "coverage",
      "creator",
      "date",
      "description",
      "format",
      "identifier",
      "language",
      "publisher",
      "relation",
      "rights",
      "source",
      "subject",
      "title",
      "type",
    ],
  } as const,
);
