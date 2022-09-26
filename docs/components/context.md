# Context

Context is a configuration object that hosts LDkit settings for various of its
components.

The only mandatory property of the context is to specify a RDF datasource. The
minimum example of such context is the following:

```ts
import { type Context } from "ldkit";

const context: Context = {
  sources: ["https://example.com/sparql"],
};
```

The Context structure accepted by LDkit is derived from the
[RDF/JS Query specification](https://rdf.js.org/query-spec/) and made compatible
with Comunica context, for maximizing ease of adoption. Therefore, if you use
Comunica as a query engine with LDkit, chances are you do not have to to any
changes.

## LDkit context properties

| Key          | Type         | Description                                                                                                                     |
| ------------ | ------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| **sources**  | RDF.Source[] | List of RDF sources. The default query engine included in LDkit accepts only a single source, and it must be a SPARQL endpoint. |
| **fetch**    | typeof fetch | Custom fetch function.                                                                                                          |
| **language** | string       | Preferred data language - for cases when you query multilingual data.                                                           |
| **graph**    | string       | IRI of a graph to constrain - if you want to query data stored in a particular named graph.                                     |

## Setting default context

Context needs to be passed to a [resource](./resource) as a parameter, and there
are two ways how to handle that. Either you can pass the context directly as an
argument when creating the resource, or you can set a context as a default one.
If there is a default context, then the resource will use that context, if you
do not provide one directly.

```ts
import { type Context, createResource, setDefaultContext } from "ldkit";

const context: Context = {
  sources: ["https://example.com/sparql"],
  language: "en",
};

setDefaultContext(context);

const customContext: Context = {
  ...context,
  language: "cs",
};

const firstResource = createResource(FirstSchema); // will use the default context
const secondResource = createResource(SecondSchema, customContext); // will use custom context
```
