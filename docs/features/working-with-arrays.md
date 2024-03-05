# Working with arrays

The LDkit library provides a simple and intuitive way to work with arrays in
linked data contexts. This section focuses on the manipulation of array
elements, including adding and removing elements.

## Initializing and Defining Models

Before working with arrays, initialize your data source and define your data
schema. Examples below make use of a Director schema, having a director name and
a list of movies:

```typescript
import { type Context, createLens, createNamespace } from "ldkit";

// Create a custom namespace
const ns = createNamespace(
  {
    "iri": "http://ns/",
    "prefix": "ns",
    "terms": [
      "name",
      "movie",
    ],
  } as const,
);

// Create a schema
const DirectorSchema = {
  name: ns.name,
  movies: {
    "@id": ns.movie,
    "@array": true,
  },
} as const;

const Directors = createLens(DirectorSchema);

// Add a director with a an empty list of movies
await Directors.insert({
  $id: "https://Quentin_Tarantino",
  name: "Quentin Tarantino",
  movies: [],
});
```

## Updating arrays

To modify array elements, use the `Lens.update` method. This method supports
different operations.

1. **Setting an Array**: Replace the entine array with a new set of elements

```typescript
await Directors.update({
  $id: "https://Quentin_Tarantino",
  movies: {
    $set: ["Pulp Fiction", "Reservoir Dogs"],
  },
});
```

2. **Adding Elements**: Append new elements to the array

```typescript
await Directors.update({
  $id: "https://Quentin_Tarantino",
  movies: {
    $add: ["Kill Bill", "Kill Bill 2"],
  },
}); // The `movies` is now ["Pulp Fiction", "Reservoir Dogs", "Kill Bill", "Kill Bill 2"]
```

3. **Removing Elements**: Remove specific elements from the array

```typescript
await Directors.update({
  $id: "https://Quentin_Tarantino",
  movies: {
    $remove: ["Reservoir Dogs"],
  },
}); // The `movies` is now ["Pulp Fiction", "Kill Bill", "Kill Bill 2"]
```

4. **Setting an Empty Array**: Clear all elements from the array

```typescript
await Directors.update({
  $id: "https://Quentin_Tarantino",
  movies: {
    $set: [], // Remove all movies
  },
});
```

## Working with Multiple Entitites

You can also perform array updates on multiple entities simultaneously using a
single SPARQL query.

```typescript
await Directors.insert({
  $id: "https://David_Fincher",
  name: "David Fincher",
  movies: ["Fight Club", "The Social Network"],
});

await Directors.update({
  $id: "https://Quentin_Tarantino",
  movies: {
    $set: ["Inglorious Basterds"],
  },
}, {
  $id: "https://David_Fincher",
  movies: {
    $add: ["The Curious Case of Benjamin Button"],
  },
});
```
