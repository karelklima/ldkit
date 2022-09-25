import { createNamespace } from "./namespace.ts";

export default createNamespace(
  {
    iri: "http://ldkit/",
    prefix: "ldkit:",
    terms: ["Resource"],
  } as const,
);
