# LDkit - Linked Data for TypeScript developers.

**LDkit** is **Linked Data** query toolkit for **TypeScript** developers. It
provides ORM-like abstraction over [RDF](https://www.w3.org/RDF/) datasources.
You define the data model and then you can retrieve or update data without any
extra hustle. LDkit will generate SPARQL queries, retrieves RDF data and
converts them to TypeScript native types.

## 💣 Key Features

- Next-generation ORM-like [RDF](https://www.w3.org/RDF/) abstraction.
- Retrieve and update data using reusable data models.
- Compatible with [Comunica](https://comunica.dev) query engine (you can even
  write your own!).
- 10+ popular ontologies included.
- First class TypeScript support, best in class developer experience.
- Runs in browser, [Deno](https://deno.land) and [Node](nodejs.org).
- ...and more!

## 📖 Documentation

The [documentation](https://ldkit.io/docs) and examples are available on
[ldkit.io](https://ldkit.io).

## 🚀 Getting Started

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
import { createLens, type Options } from "ldkit";
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

// Create options for query engine
const options: Options = {
  sources: ["https://dbpedia.org/sparql"], // SPARQL endpoint
  language: "en", // Preferred language
};

// Create a resource using the data schema and options above
const Persons = createLens(PersonSchema, options);
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

More complex examples can be found in [documentation](https://ldkit.io/docs).

## License

[MIT License](./LICENSE.md)

Copyright © 2021-present [Karel Klima](https://karelklima.com)
