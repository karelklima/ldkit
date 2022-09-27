# Components

Complete LDkit workflow of querying Linked Data is facilitated by several
components working in tandem.

The usual task of working with Linked Data comprises of these protocols:

- You define a data source and other options through
  [context](./components/context).
- You define a [namespace](./components/namespaces) for the data to be
  retrieved, or use an existing one.
- You define a data [schema](./components/schema) with the help of namespaces.
- You create a [resource](./components/resource) and pass it the schema and
  context to query data.
- Optionally, you can tweak the [query engine](./components/query-engine).

As an added bonus, LDkit provides several low-level
[power tools](./components/power-tools) in case you need to work with RDF
directly, create SPARQL queries or transform data from and to RDF using a
[schema](./components/schema).
