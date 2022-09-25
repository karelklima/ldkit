# Namespaces

Namespaces are strongly typed containers for Linked Data vocabularies. They
provide type safe access to all vocabulary terms as well as IDE auto-complete
for the best developer experience.

```ts
import { createNamespace } from "ldkit";

const onto = createNamespace(
  {
    iri: "http://www.example.com/ontology#",
    prefix: "onto:",
    terms: [
      "object",
      "predicate",
      "subject",
    ],
  } as const,
);

console.log(onto.subject); // prints http://www.example.com/ontology#subject
console.log(onto.unknown); // TypeScript error! This term does not exist
```

In addition to terms, namespaces include `$iri` and `$prefix` properties to
access its IRI and prefix denomination.

## Build-in namespaces

LDkit ships with several ready to use namespaces of the most widely used Linked
Data ontologies.

These ontologies are provided as a `ldkit/namespaces` subpackage. You can use
them like this:

```ts
import { rdf, schema } from "ldkit/namespaces";

console.log(rdf.type); // prints http://www.w3.org/1999/02/22-rdf-syntax-ns#type
console.log(schema.Person); // prints http://schema.org/Person
```

> If you are using Deno without the recommended import map, you can import
> namespaces like this:
>
> ```ts
> import { rdf, schema } from "https://deno.land/x/ldkit@$VERSION/mod.ts";
> ```

### List of included namespaces

| Shortcut    | Name                                        | Namespace                                   |
| ----------- | ------------------------------------------- | ------------------------------------------- |
| **dbo**     | DBPedia ontology                            | https://dbpedia.org/ontology/               |
| **dc**      | DCMI Metadata Terms                         | http://purl.org/dc/elements/1.1/            |
| **dcterms** | DCMI Metadata Terms                         | http://purl.org/dc/terms/                   |
| **foaf**    | FOAF ontology                               | http://xmlns.com/foaf/0.1/                  |
| **gr**      | Good Relations                              | http://purl.org/goodrelations/v1#           |
| **rdf**     | RDF vocabulary                              | http://www.w3.org/1999/02/22-rdf-syntax-ns# |
| **rdfs**    | RDF Schema 1.1                              | http://www.w3.org/2000/01/rdf-schema#       |
| **schema**  | Schema.org                                  | https://schema.org/                         |
| **sioc**    | SIOC ontology                               | http://rdfs.org/sioc/ns#                    |
| **skos**    | SKOS (Simple Knowledge Organization System) | http://www.w3.org/2008/05/skos#             |
| **xsd**     | XML Schema Datatypes                        | http://www.w3.org/2001/XMLSchema#           |

## Creating your own namespace

When accessing Linked Data on the web, it is highly likely that you will need to
create a custom namespace to help you create LDkit schemas. Below is an example
of such a namespace facilitating full text Lucene-based search in GraphDB.

```ts
import { createNamespace } from "ldkit";

export const lucene = createNamespace(
  {
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
  } as const, // This line is important for inferring TypeScript types
);

console.log(lucene.query); // prints http://www.ontotext.com/connectors/lucene#query
```

## Using namespaces in a schema

Using namespaces in schema is optional, but recommended. You can use namespace
terms as keys, or you can use even shorter aliases.

```ts
import { dbo, rdfs } from "ldkit/namespaces";
// Create a schema
const PersonSchema = {
  "@type": dbo.Person,
  name: rdfs.label,
  abstract: dbo.abstract,
  birthDate: {
    "@id": dbo.birthDate,
    "@type": xsd.date,
  },
} as const;
```
