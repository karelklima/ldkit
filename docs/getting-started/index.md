# Getting Started

If you are using Node, then you can install LDkit using your favourite package
manager.

```bash
npm i ldkit
```

For Deno environment, you can import LDkit like this:

```ts
import * as ldkit from "https://deno.land/x/ldkit/mod.ts";
```

### Set up RDF source and create data schema

```ts
import { type Context, createResource } from "ldkit";
import { dbo, rdfs, xsd } from "ldkit/namespaces";

// Create a context for query engine
const context: Context = {
  sources: ["https://dbpedia.org/sparql"], // SPARQL endpoint
  language: "en", // Preferred language
};

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

// Create a resource using the data schema and context above
const Person = createResource(PersonSchema, context);
```

### List all available data

```ts
// List all persons
const persons = await Person.find();
for (const person of persons) {
  console.log(person.name); // string
  console.log(person.birthDate); // Date
}

// Get total count of all persons
const count = await Person.count();
console.log(count); // number
```

### Get a particular entity

```ts
// Get a particular person identified by IRI
const ada = await Person.findByIri("http://dbpedia.org/resource/Ada_Lovelace");
console.log(ada?.name); // string "Ada Lovelace"
console.log(ada?.birthDate); // Date object of 1815-12-10
```

### Data manipulation - insert, update and delete

```ts
// Insert a new person
Person.insert({
  $id: "http://dbpedia.org/resource/Alan_Turing",
  name: "Alan Turing",
  birthDate: new Date("1912-06-23"),
});

// Modify a person's name
Person.update({
  $id: "http://dbpedia.org/resource/Alan_Turing",
  name: "Not Alan Turing",
});

// Delete a person
Person.delete("http://dbpedia.org/resource/Alan_Turing");
```
