import {
  createResource,
  createNamespace,
  type Context,
  type SchemaInterface
} from "ldkit";
import { xsd } from "ldkit/namespaces";
import { QueryEngine as Comunica } from "@comunica/query-sparql-rdfjs";

import { Store } from "n3";

const t = createNamespace({
  iri: "https://todos/",
  prefix: "t:",
  terms: ["Todo", "description", "done"],
} as const);

const TodoSchema = {
  "@type": t.Todo,
  description: t.description,
  done: {
    "@id": t.done,
    "@type": xsd.boolean,
  },
} as const;

export const store = new Store();

const context: Context = {
  sources: [store],
};

const engine = new Comunica();

export type TodoInterface = SchemaInterface<typeof TodoSchema>;

export const Todos = createResource(TodoSchema, context, engine);

export const getRandomId = () =>
  `https://todos/${1000 + Math.floor(Math.random() * 1000)}`;
