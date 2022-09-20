import { createNamespace } from "./namespace.ts";

export default createNamespace(
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
