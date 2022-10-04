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

### Create data schema and set up RDF source

```ts
import { type Context, createLens } from "ldkit";
import { dbo, rdfs, xsd } from "ldkit/namespaces";

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

// Create a context for query engine
const context: Context = {
  sources: ["https://dbpedia.org/sparql"], // SPARQL endpoint
  language: "en", // Preferred language
};

// Create a resource using the data schema and context above
const Persons = createLens(PersonSchema, context);
```

### List all available data

```ts
// List all persons
const persons = await Persons.find();
for (const person of persons) {
  console.log(person.name); // string
  console.log(person.birthDate); // Date
}

// Get total count of all persons
const count = await Persons.count();
console.log(count); // number
```

### Get a particular entity

```ts
// Get a particular person identified by IRI
const ada = await Persons.findByIri("http://dbpedia.org/resource/Ada_Lovelace");
console.log(ada?.name); // string "Ada Lovelace"
console.log(ada?.birthDate); // Date object of 1815-12-10
```

### Data manipulation - insert, update and delete

```ts
// Insert a new person
Persons.insert({
  $id: "http://dbpedia.org/resource/Alan_Turing",
  name: "Alan Turing",
  birthDate: new Date("1912-06-23"),
});

// Modify a person's name
Persons.update({
  $id: "http://dbpedia.org/resource/Alan_Turing",
  name: "Not Alan Turing",
});

// Delete a person
Persons.delete("http://dbpedia.org/resource/Alan_Turing");
```
