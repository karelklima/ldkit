# Query Engine

LDkit ships with a simple SPARQL query engine that lets you execute queries over
a SPARQL endpoint. This engine is used by default, unless you specify a custom
one.

If you want to query other RDF data sources like files or in-memory quad stores,
you need to use a custom query engine like [Comunica](https://comunica.dev), or
implement your own.

## Default query engine

```ts
import { QueryEngine } from "ldkit";

const engine = new QueryEngine();
```

The `QueryEngine` follows
[RDF/JS Query specification](https://rdf.js.org/query-spec/) and implements the
`StringSparqlQueryable` interface.

The `QueryEngine` is configurable through [Options](./options) object.

```ts
import { type Options, QueryEngine } from "ldkit";

const options = {
  sources: ["https://example.com/sparql"], // required, must include one SPARQL endpoint
  fetch: customFetchFunction, // optional, must follow standard fetch interface
} satisfies Options;
const engine = new QueryEngine();

const response = await engine.queryBoolean("ASK { ?s ?p ?o }", context);
```

> Note: The default query engine supports all SPARQL endpoints that conform to
> the SPARQL 1.1 specification and can return data of MIME
> `application/sparql-results+json` for `SELECT` and `ASK` queries, and
> `text/turtle` or `application/rdf+json` for `CONSTRUCT` queries.

## Custom query engine

You can use a custom query engine with LDkit - same as the included query
engine, it needs to implement `StringSparqlQueryable` interface from the
[RDF/JS Query specification](https://rdf.js.org/query-spec/).

For advanced federated querying over multiple datasources you can also use
Comunica, or a custom engine derived from that - see
[Query with Comunica](../features/query-with-comunica).

## Setting default query engine

A query engine instance needs to be passed to a data [Lens](./lens) as a
parameter in order to query data, and there are two ways how to handle that.
Either you can pass the engine directly as part of options argument when
creating the `Lens` instance, or you can set an engine instance as a default
one. If there is a default engine instance, then the `Lens` will use that
engine, if you do not provide one directly.

```ts
import { createLens, setGlobalOptions } from "ldkit";

const engine = new MyCustomQueryEngine();
setGlobalOptions({ engine });

const MyLens = createLens(MySchema); // will use the custom engine, which is now default
```
