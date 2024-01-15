import { type Options } from "ldkit";

export const options: Options = {
  source: "https://dbpedia.org/sparql",
  language: "en",
  logQuery: (query) => console.log("SPARQL QUERY", query),
};
