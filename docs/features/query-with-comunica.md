# Query with Comunica

LDkit is fully compatible with [Comunica](https://comunica.dev/)-based query
engine.

Comunica lets you access RDF data from multiple sources and various source
types, including Solid pods, RDF files, Triple/Quad Pattern Fragments, HDT
files.

> Note: If you need to access data through a single SPARQL endpoint, it is
> recommended to use the default [Query Engine](../components/query-engine)
> shipped with LDkit. The built-in engine is lightweight and optimized for being
> used in browser.

To use Comunica with LDkit, simply pass its instance to a
[Lens](../components/lens), or set it as the default engine using global
options. The example below shows a setup how to query in-memory data using
[N3](https://github.com/rdfjs/N3.js/) store. This particular example uses the
`@comunica/query-sparql-rdfjs` engine.

```ts
import { createLens, type Options } from "ldkit";
import { QueryEngine as Comunica } from "@comunica/query-sparql-rdfjs";
import { Store } from "n3";

const store = new Store();
const engine = new Comunica();

const options = {
  sources: [store],
  engine,
} satisfies Options;

const resource = createLens(MySchema, options);
```

The [Options](../components/options) object schema for LDkit is the superset of
the _Context_ for Comunica. The _Options_ that you pass to a resource, or a
[default options](../components/options) object (if you set it up) eventually
gets passed to Comunica engine instance.

## Using Comunica as a server

If you want to query over an RDF source different from a SPARQL endpoint from a
user facing application, but don't want to compromise performance, you can
[use Comunica as a proxy SPARQL endpoint](https://comunica.dev/docs/query/getting_started/setup_endpoint/),
and use the LDkit default [query engine](../components/query-engine) to query
this endpoint.

The Comunica browser distribution is a 1.2 MB file, which you may not want to
include in a client-facing application. In comparison, the LDkit default query
engine is a simple class of 150 lines of code.
