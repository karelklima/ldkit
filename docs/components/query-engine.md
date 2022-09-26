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

The `QueryEngine` is configurable through Context.

```ts
import { type Context, QueryEngine } from "ldkit";

const context: Context = {
  sources: ["https://example.com/sparql"], // required, must include one SPARQL endpoint
  fetch: customFetchFunction, // optional, must follow standard fetch interface
};
const engine = new QueryEngine();

const response = await engine.queryBoolean("ASK { ?s ?p ?o }", context);
```

## Custom query engine

You can use a custom query engine with LDkit - same as the included query
engine, it needs to implement `StringSparqlQueryable` interface from the
[RDF/JS Query specification](https://rdf.js.org/query-spec/).

For advanced federated querying over multiple datasources you can also use
Comunica, or a custom engine derived from that - see
[Query with Comunica](../advanced/query-with-comunica).
