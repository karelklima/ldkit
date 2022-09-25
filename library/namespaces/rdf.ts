import { createNamespace } from "./namespace.ts";

export default createNamespace(
  {
    iri: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
    prefix: "rdf:",
    terms: [
      "Alt",
      "Bag",
      "CompoundLiteral",
      "HTML",
      "JSON",
      "List",
      "PlainLiteral",
      "Property",
      "Seq",
      "Statement",
      "XMLLiteral",
      "direction",
      "first",
      "langString",
      "language",
      "nil",
      "object",
      "predicate",
      "rest",
      "subject",
      "type",
      "value",
    ],
  } as const,
);
