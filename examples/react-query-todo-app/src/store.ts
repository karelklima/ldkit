import {
  type Options,
  createLens,
  createNamespace,
  type SchemaInterface,
} from "ldkit";
import { xsd } from "ldkit/namespaces";
import { QueryEngine as Comunica } from "@comunica/query-sparql-rdfjs";

import { N3 } from "ldkit/rdf";

const t = createNamespace(
  {
    iri: "https://todos/",
    prefix: "t:",
    terms: ["Todo", "description", "done"],
  } as const,
);

const TodoSchema = {
  "@type": t.Todo,
  description: t.description,
  done: {
    "@id": t.done,
    "@type": xsd.boolean,
  },
} as const;

export const store = new N3.Store();

const options: Options = {
  sources: [store],
  engine: new Comunica(),
  logQuery: (query) => console.log(query)
};

export type TodoInterface = SchemaInterface<typeof TodoSchema>;

export const Todos = createLens(TodoSchema, options);

export const getRandomId = () =>
  `https://todos/${1000 + Math.floor(Math.random() * 1000)}`;
