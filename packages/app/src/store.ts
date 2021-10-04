import { createResource } from "@ldkit/core";
import type { SchemaInterface } from "@ldkit/core";
import { xsd, createNamespace } from "@ldkit/namespaces";
import { createDefaultContext } from "@ldkit/engine";

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

createDefaultContext(store);

export type TodoInterface = SchemaInterface<typeof TodoSchema>;

export const Todos = createResource(TodoSchema);

export const getRandomId = () =>
  `https://todos/${1000 + Math.floor(Math.random() * 1000)}`;
