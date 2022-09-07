import {
  type SchemaInterface,
  createResource,
  createNamespace,
  createDefaultContext,
} from "ldkit";
import { xsd, skos, dcterms } from "ldkit/namespaces";

export const popisDat = createNamespace({
  iri: "http://onto.fel.cvut.cz/ontologies/slovník/agendový/popis-dat/pojem/",
  prefix: "popisdat:",
  terms: ["je-pojmem-ze-slovníku"],
} as const);

export const lucene = createNamespace({
  iri: "http://www.ontotext.com/connectors/lucene#",
  prefix: "lucene:",
  terms: [
    "query",
    "entities",
    "snippets",
    "snippetText",
    "snippetField",
    "snippetSize",
    "score",
  ],
} as const);

export const lucene_instance = createNamespace({
  iri: "http://www.ontotext.com/connectors/lucene/instance#",
  prefix: "lucene_instance:",
  terms: ["label_index", "defcom_index"],
} as const);

const SearchSchema = {
  "@type": skos.Concept,
  label: skos.prefLabel,
  snippetField: lucene.snippetField,
  snippetText: lucene.snippetText,
  score: {
    "@id": lucene.score,
    "@type": xsd.double,
  },
  vocabulary: popisDat["je-pojmem-ze-slovníku"],
  vocabularyTitle: dcterms.title,
} as const;

const customFetch = (input: string | Request | URL, init?: RequestInit) => {
  console.log("CUSTOM FETCH FETCHING");
  const headers = init?.headers as Headers;
  const ct = (init?.headers as Headers).get("Content-type");
  console.log(ct);
  if (ct === "application/x-www-form-urlencoded") {
    headers.set(
      "Content-type",
      "application/x-www-form-urlencoded; charset=UTF-8"
    );
  }
  return fetch(input, init);
};

createDefaultContext({
  sources: [
    {
      type: "sparql",
      value: "https://xn--slovnk-7va.gov.cz/sparql",
    },
  ],
  fetch: customFetch,
});

export type SearchInterface = SchemaInterface<typeof SearchSchema>;

export const SearchResource = createResource(SearchSchema);
