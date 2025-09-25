# TODO app with custom semantics

This is an example TODO list application with an RDF data model based on a
custom ontology.

The goal of this application is to showcase how to incorporate advanced
semantics into Linked Data applications.

Semantics elements:

- Ontology: [./semantics/todo_ontology.ttl](./semantics/todo_ontology.ttl)
- ShEx schema: [./semantics/todo_schema.shex](./semantics/todo_schema.shex)
- LDkit schema: [./semantics/todo_schema.ts](./semantics/todo_schema.ts)

The ShEx schema is built using the custom ontology. LDkit schema is then built
using the ShEx schema.

## How to run the application

```
npm install
npm run dev
```
