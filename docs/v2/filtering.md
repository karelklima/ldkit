# Filtering

LDkit comes with powerful search and filtering capabilities, enabling users to
narrow data results and explore large datasets. The feature integrates
seamlessly with the existing [Lens](../components/lens) `find` method, allowing
for controlled data retrieval.

LDkit allows various search and filtering operations like `$equals`, `$not`,
`$contains`, `$strStarts`, `$strEnds`, `$gt`, `$lt`, `$gte`, `$lte`, `$regex`,
`$langMatches`, and `$filter`. Each is illustrated below with examples.

### Simple example

```ts
import { createLens } from "ldkit";
import { schema, xsd } from "ldkit/namespaces";

// Create a schema
const PersonSchema = {
  "@type": schema.Person,
  name: schema.name,
  birthDate: {
    "@id": schema.birthDate,
    "@type": xsd.date,
  },
} as const;

// Create a lens instance
const Persons = createLens(PersonSchema);

await Persons.find({
  where: {
    name: "Ada Lovelace",
  },
}); // Returns list of all persons named "Ada Lovelace"
```

### Comparison operators

```typescript
await Persons.find({
  where: {
    name: {
      $equals: "Ada Lovelace", // FILTER (?value = "Ada Lovelace")
      $not: "Alan Turing", // FILTER (?value != "Alan Turing")
    },
    birthDate: {
      $lt: new Date("01-01-1900"), // FILTER (?value < "01-01-1900"@xsd:date)
      $lte: new Date("01-01-1900"), // FILTER (?value <= "01-01-1900"@xsd:date)
      $gt: new Date("01-01-1900"), // FILTER (?value > "01-01-1900"@xsd:date)
      $gte: new Date("01-01-1900"), // FILTER (?value >= "01-01-1900"@xsd:date)
    },
  },
});
```

### String functions

```typescript
await Persons.find({
  where: {
    name: {
      $contains: "Ada", // FILTER CONTAINS(?value, "Ada")
      $strStarts: "Ada", // FILTER STRSTARTS(?value, "Ada")
      $strEnds: "Lovelace", // FILTER STRENDS(?value, "Lovelace")
      $langMatches: "fr", // FILTER LANGMATCHES(LANG(?value), "fr")
      $regex: "^A(.*)e$", // FILTER REGEX(?value, "^A(.*)e$")
    },
  },
});
```

### Custom filtering

On top of the above, it is possible to specify a custom filter function using
the SPARQL filtering syntax. There is a special placeholder `?value` used for
the value of the property to be filtered. This placeholder is replaced by actual
variable name during runtime.

```typescript
await Persons.find({
  where: {
    name: {
      $filter: "STRLEN(?value) > 10", // FILTER (STRLEN(?value) > 10)
    },
  },
});
```
