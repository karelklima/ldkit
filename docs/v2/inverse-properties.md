# Inverse properties

LDkit allows for resolving incoming links in linked data. This is particularly
useful when you want to query entities that are related in reverse order. In
typical scenarios, a property of a particular entity corresponds on a conceptual
level to a triple like (_entity property value_), but with inverse properties,
you can flip this to represent (_value property entity_). This feature is
crucial for queries where you need to find entities that reference a given
entity.

To illustrate the use of inverse properties, let's consider a scenario where we
want to list all movies directed by a particular director.

## Creating context and Schemas

First, define your context, schemas and lens. Here, we create two schemas:
`MovieSchema` and `DirectorSchema`.

```typescript
import { createLens } from "ldkit";
import { dbo, rdfs, xsd } from "ldkit/namespaces";

// Context with SPARQL endpoint and language preference
const context = {
  sources: ["https://dbpedia.org/sparql"],
  language: "en",
};

// Movie schema
const MovieSchema = {
  "@type": dbo.Film,
  name: rdfs.label,
} as const;

// Director schema with inverse property
const DirectorSchema = {
  "@type": dbo.Person,
  name: rdfs.label,
  birthDate: {
    "@id": dbo.birthDate,
    "@type": xsd.date,
  },
  isDirectorOf: {
    "@id": dbo.director,
    "@inverse": true, // This is cool!
    "@array": true,
    "@schema": MovieSchema,
  },
} as const;

// Create Directors Lens to query data
const Directors = createLens(DirectorSchema, context);
```

## Using inverse properties

In `DirectorSchema`, the `isDirectorOf` property is defined with `@inverse`
modifier. This means that the library will automatically resolve the inverse
relationship, effectively querying for movies where the given person is the
director.

```typescript
// Fetch a particular director by IRI
const tarantino = await Directors.findByIri(
  "http://dbpedia.org/resource/Quentin_Tarantino",
);

if (tarantino === null) {
  throw new Error("Tarantino not found?!");
}

// List movies directed by Tarantino
console.log("List of movies directed by Tarantino:");
for (const movie of tarantino.isDirectorOf) {
  console.log(movie.name);
}
```

## Benefits of Inverse Properties

- **Simplicity**: The feature simplifies the querying of inverse relationships,
  making code more readable and maintainable.
- **Efficiency**: It enables efficient data retrieval from SPARQL endpoints by
  inverting the usual subject-predicate-object query pattern.
- **Flexibility**: Can be used in various scenarios where the relationship
  between entities is better expressed or only available in a reversed order.

Inverse properties in LDkit offer an elegant solution for querying linked data
in reverse order. By simply adding `"@inverse": true` to a property in your
schema, you can easily retrieve and work with entities that are related in a
reverse direction. This feature is especially useful in complex data models
where relationships are not always straightforward.
