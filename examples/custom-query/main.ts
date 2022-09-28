import { lucene, lucene_instance, popisDat, SearchResource } from "./store.ts";
import { $ } from "ldkit/sparql";
import { DataFactory } from "ldkit/rdf";
import { dcterms, skos } from "ldkit/namespaces";

console.log("CUSTOM SEARCH QUERY USING LUCENE GRAPHDB CONNECTOR");

const searchString = "ní*";
const splitExactMatch = "<em>ní</em>";

const dataFactory = new DataFactory();
const n = (value: string) => dataFactory.namedNode(value);

const s = (str: string) => `"${str}"`;

const query = $`
CONSTRUCT {
  ?entity a ${n(skos.Concept)} ;
          ${n(skos.prefLabel)} ?label ;
          ${n(lucene.snippetText)} ?snippetText ;
          ${n(lucene.snippetField)} ?snippetField ;
          ${n(lucene.score)} ?score ;
          ${n(popisDat["je-pojmem-ze-slovníku"])} ?vocabulary ;
          ${n(dcterms.title)} ?vocabularyTitle .
} WHERE {
  SELECT DISTINCT ?entity ?label ?snippetField ?snippetText ?score ?vocabulary ?vocabularyTitle {
    { ?search a ${n(lucene_instance.label_index)} } 
    UNION 
    { ?search a ${n(lucene_instance.defcom_index)} }
    ?search ${n(lucene.query)} ${s(searchString)} ;
            ${n(lucene.snippetSize)} 2000 ;
            ${n(lucene.entities)} ?entity . 
    GRAPH ?g {
      ?entity a ${n(skos.Concept)} ;
              ${n(skos.prefLabel)} ?label .
    }
    ?entity ${n(popisDat["je-pojmem-ze-slovníku"])} ?vocabulary .
    ?vocabulary ${n(dcterms.title)} ?vocabularyTitle .
    ?entity ${n(lucene.score)} ?initScore ;
            ${n(lucene.snippets)} _:s .
    _:s ${n(lucene.snippetText)} ?snippetText ;
        ${n(lucene.snippetField)} ?snippetField .
    FILTER (lang(?label) = "cs")
    BIND(IF(lcase(str(?snippetText)) = lcase(str(${
  s(
    splitExactMatch,
  )
})), ?initScore * 2, IF(CONTAINS(lcase(str(?snippetText)), ${
  s(
    splitExactMatch,
  )
}), IF(?snippetField = "label", ?initScore * 1.5, ?initScore), ?initScore)) as ?exactMatchScore)
    BIND(IF(?snippetField = "label", ?exactMatchScore * 2, IF(?snippetField = "definition", ?exactMatchScore * 1.2, ?exactMatchScore)) as ?score)
  }
  ORDER BY desc(?score)
  LIMIT 100
}
`.toString();

console.log(query);

const results = await SearchResource.query(query);
console.log("NUMBER OF RESULTS", results.length);
for (const r of results) {
  console.log(
    r.label,
    r.score,
    r.snippetField,
    r.snippetText,
    r.vocabulary,
    r.vocabularyTitle,
  );
}
