# Lens

A data **Lens** turns a particular data [Schema](./schema) to an interactive
entity repository. In principle, a Lens is a collection of data entities that
conform to the specified Schema. Through Lens instances you can find or update
data easily.

In background, Lens handle building and executing SPARQL queries, data retrieval
and transformation according to the data Schema.

## Creating a resource

A Lens requires a [Schema](./schema), a [Context](./context), and a
[Query Engine](./query-engine). If you do not specify context or engine, default
ones will be used.

```ts
import { type Context, createLens } from "ldkit";

const context: Context = {
  sources: ["https://example.com/sparql"],
};

const MyLens = createLens(MySchema, context); // will use default query engine
```

## Lens usage

The examples below show a simple `Persons` Lens on top of DBpedia - a collection
of entities of type _dbo:Person_ that have a name, an abstract and a birth date.

### Create a Lens instance to query persons

```ts
import { type Context, createLens } from "ldkit";
import { dbo, rdfs, xsd } from "ldkit/namespaces";

const context: Context = {
  sources: ["https://example.com/sparql"],
};

// Create a schema
const PersonSchema = {
  "@type": dbo.Person,
  name: rdfs.label,
  abstract: dbo.abstract,
  birthDate: { "@id": dbo.birthDate, "@type": xsd.date },
} as const;

// Create a resource using the data schema and context above
const Persons = createLens(PersonSchema, context);
```

### List all matched persons

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

When modifying data, you can use the native data format specified by the data
Schema. The data gets transformed to RDF behind the scenes.

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

### Data manipulation - insert or update raw data

If the provided data update methods are not sufficient, there are special
methods `insertData` and `deleteData` where you can pass raw data in RDF data
format according to the
[RDF/JS data specification](https://rdf.js.org/data-model-spec/). You can use
the included DataFactory implementation, or use your own.

```ts
import { DataFactory } from "ldkit/rdf";

const df = new DataFactory();
const quad = df.quad(
  df.namedNode("http://dbpedia.org/resource/Alan_Turing")
  df.namedNode(rdfs.label),
  df.literal("Maybe Not Alan Turing")
);
await Persons.insertData([quad]); // quad added to the database
```
