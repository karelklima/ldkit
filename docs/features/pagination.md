# Pagination

Pagination feature enhances data accessibility by enabling users to efficiently
navigate through large datasets. The feature integrates seamlessly with the
existing [Lens](../components/lens) `find` method, allowing for controlled data
retrieval.

### Specify a range of data to query

```ts
import { createLens } from "ldkit";
import { schema } from "ldkit/namespaces";

// Create a schema
const PersonSchema = {
  "@type": schema.Person,
  name: schema.name,
} as const;

// Create a lens instance
const Persons = createLens(PersonSchema);

await Persons.find({ take: 10 }); // returns first 10 persons or less
await Persons.find({ take: 10, skip: 10 }); // returns the next set of 10 persons
await Persons.find(); // returns the default set of 1000 persons maximum
```

### Setting global defaults

For consistent pagination behavior across an application, you can define a
global `take` default in the [Options](../components/options). This eliminates
the need to repeatedly set take in each find call, streamlining the development
process. The default value for `take` is 1000.

```ts
import { createLens, type Options, setGlobalOptions } from "ldkit";

const options = {
  sources: ["https://example.com/sparql"],
  take: 100, // set the default take value to 100
} satisfies Options;

setGlobalOptions(options);

const customOptions = {
  ...options,
  take: 10,
} satisfies Options;

const First = createLens(FirstSchema); // will use the global options with take = 100
const Second = createLens(SecondSchema, customOptions); // will use custom options with take = 10
```
