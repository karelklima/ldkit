import { createNamespace } from "ldkit";

export const yago = createNamespace({
  iri: "http://dbpedia.org/class/yago/",
  prefix: "yago:",
  terms: [
    "Actor109765278",
    "Composer109947232",
    "Director110014939",
    "Writer110794014",
  ],
} as const);
