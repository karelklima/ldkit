# Schema

On a conceptual level, a data schema is a definition of a data shape through
which you query RDF data. It is similar to a data model for standard ORM
libraries. Through schema, you describe a class of entities and their properties
to be retrieved from an RDF source.

LDkit schemas are based on
[JSON-LD context](https://json-ld.org/spec/latest/json-ld/) format, and simple
JSON-LD contexts can usually be easily transformed to schemas.

## Example of a schema

Below is a simple example of a schema to retrieve persons, including their name
and birt date.

```ts
// `schema` is `https://schema.org/` namespace
import { schema } from "ldkit/namespaces";

const PersonSchema = {
  "@type": schema.Person, // setting `@type` is required
  name: schema.name, // retrieve property `schema.name` and alias it as `name`
  birthDate: { // retrieve property `schema.birthDate` and alias it as `birthDate`
    "@id": schema.birthDate,
    "@type": xsd.date,
  },
} as const; // this is important for proper type hints
```

The schema translates to the following:

- I want to query entities of RDF type `schema:Person`.
- I want each entity to have `schema:name` property that will be available as a
  property `name` of type `string`.
- I want each entity to have `schema:birthDate` property that will be available
  as a property `birthDate` of type `Date`.

Using the schema, the resulting entity in TypeScript will conform to the
following type:

```ts
type PersonType = {
  $id: string; // IRI
  name: string;
  birthDate: Date;
};
```

## Schema features

When defining a schema, you can specify:

- one or more entity RDF types
- property data type (and corresponding TypeScript native type)
- whether a property is optional or required
- whether a property is an array
- whether to retrieve multi-language string literals
- _nested schemas_ within other schemas

### Entity type

You can define one or more entity RDF type to narrow the search results. Setting
the RDF type is recommended for optimal performance.

```ts
const MySchema = {
  "@type": "http://example.com/ontology/MyClass",
} as const;

const MyOtherSchema = {
  "@type": [
    "http://example.com/ontology/MyClass",
    "http://example.com/ontology/MyOtherClass",
  ],
} as const;
```

### Entity property reference

Each property defined in a schema must correspond to the following markup:

```ts
import { rdf, xsd } from "ldkit/namespaces";
const MySchema = {
  propertyShortName: {
    "@id": rdf.label, // RDF name of the property
    "@type": xsd.string, // RDF type of the property
    "@optional": true, // if present, the property is optional
    "@array": true, // if present, the resulting property is always an array
    "@multilang": true, // if present, the resulting property is a map of languages and literals
    "@schema": SomeSubschema, // if present, uses a nested schema
  },
} as const;
```

Unless specified otherwise, it is assumed that any property is of type
`xsd:string`, required, and not an array. You can override these defaults
per-property.

In addition, there is a shortcut to specify default properties. The following
two schemas are equivalent:

```ts
import { schema } from "ldkit/namespaces";

const SchemaOne = {
  "@type": schema.Person,
  name: schema.name,
} as const;

const SchemaTwo = {
  "@type": schema.Person,
  name: {
    "@id": schema.name,
  },
};
```

### Querying multi-lingual properties

LDkit supports retrieving RDF literals with `@language` annotations. The example
bellow shows sample input data, schema and how the data is transformed using the
schema.

```ts
const inputRdfData = `
  x:A
    a x:Item ;
    x:multilang "CS"@cs, "EN"@en, "Unknown" .
`;

const schema = {
  "@type": x.Item,
  multilangProperty: {
    "@id": x.multilang,
    "@multilang": true,
  },
};

const convertedData = {
  $id: x.A,
  multilangProperty: {
    cs: "CS",
    en: "EN",
    [""]: "Unknown",
  },
};
```

### Using regular namespaces instead of aliases

If you want the resulting data to be as close as possible to the original RDF
data, you can use RDF identifiers instead of aliases.

```ts
const MySchema = {
  "@type": schema.Person,
  [schema.name]: schema.name,
};
```

### Explicitly infer resulting TypeScript type of entities

If you need, to explicitly use the resulting type of entities, that is, the
corresponding native TypeScript type of RDF data converted to JavaScript, you
can use the `SchemaInterface` helper type.

```ts
import { type SchemaInterface } from "ldkit";
import { dbo, rdfs, xsd } from "ldkit/namespaces";

const PersonSchema = {
  "@type": dbo.Person,
  name: rdfs.label,
  birthDate: {
    "@id": dbo.birthDate,
    "@type": xsd.date,
  },
} as const;

type PersonType = SchemaInterface<typeof PersonSchema>;
/**
 * {
 *   $id: IRI, // string alias
 *   name: string,
 *   birthDate: Date
 * }
 */
```

## Complete schema reference

The following schema showcases all possible supported variations.

```ts
const Thing = {
  "@type": x.X,
  required: x.required,
  optional: {
    "@id": x.optional,
    "@optional": true,
  },
  array: {
    "@id": x.array,
    "@array": true,
  },
  multilang: {
    "@id": x.multilang,
    "@multilang": true,
  },
  multilangArray: {
    "@id": x.multilangArray,
    "@multilang": true,
    "@array": true,
  },
  number: {
    "@id": x.number,
    "@type": xsd.integer,
  },
  boolean: {
    "@id": x.boolean,
    "@type": xsd.boolean,
  },
  date: {
    "@id": x.date,
    "@type": xsd.date,
  },
  nested: {
    "@id": x.nested,
    "@schema": {
      "@type": x.Nested,
      nestedValue: x.nestedValue,
    },
  },
} as const;
```

And the resulting type will be:

```ts
type ThingType = {
  $id: string;
  required: string;
  optional: string | undefined;
  array: string[];
  multilang: Record<string, string>;
  multilangArray: Record<string, string[]>;
  number: number;
  boolean: boolean;
  date: Date;
  nested: {
    $id: string;
    nestedValue: string;
  };
};
```
