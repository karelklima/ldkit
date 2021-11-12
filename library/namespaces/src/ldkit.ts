import { createNamespace } from "./namespace";

export default createNamespace({
  iri: "http://ldkit/",
  prefix: "ldkit:",
  terms: ["Resource"],
} as const);
