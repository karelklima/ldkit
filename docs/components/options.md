# Options

_Options_ is a configuration object that hosts LDkit settings for various of its
components.

The only mandatory property of the options is to specify one or more RDF
datasources. The minimum example of such context is the following:

```ts
import { type Options } from "ldkit";

const options = {
  sources: ["https://example.com/sparql"],
} satisfies Options;
```

The _Options_ structure accepted by LDkit is a superset of query engine
_Context_ defined in
[RDF/JS Query specification](https://rdf.js.org/query-spec/) and made compatible
with Comunica _Context_, for maximizing ease of adoption. Therefore, if you use
Comunica as a query engine with LDkit, chances are you do not have to to any
changes - just pass the Comunica context as LDkit options.

## LDkit Options properties

| Key          | Type                          | Description                                                                                                                     |
| ------------ | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| **engine**   | `IQueryEngine`                | Query engine to process SPARQL queries. LDkit uses the default query engine, unless specified otherwise.                        |
| **sources**  | `string[]` or `IDataSource[]` | List of RDF sources. The default query engine included in LDkit accepts only a single source, and it must be a SPARQL endpoint. |
| **fetch**    | `typeof fetch`                | Custom fetch function.                                                                                                          |
| **language** | `string`                      | Preferred data language - for cases when you query multilingual data.                                                           |
| **take**     | `number`                      | Number of resources to return by default by the Lens object. The `LIMIT` property of a `SELECT` query.                          |
| **logQuery** | `(query: string) => void`     | Function that is called every time a query is processed by the query engine. Useful for logging purposes.                       |

## Setting default Options

Options object needs to be passed to a data [Lens](./lens) as a parameter, and
there are two ways how to handle that. Either you can pass the object directly
as an argument when creating the `Lens` instance, or you can set a global
options. If there are global options set up, then the `Lens` will use the global
options object, unless you provide one directly when creating the instance.

```ts
import { createLens, type Options, setGlobalOptions } from "ldkit";

const options = {
  sources: ["https://example.com/sparql"],
  language: "en",
} satisfies Options;

setGlobalOptions(options);

const customOptions = {
  ...options,
  language: "cs",
} satisfies Options;

const firstResource = createLens(FirstSchema); // will use the global options
const secondResource = createLens(SecondSchema, customOptions); // will use custom options
```
