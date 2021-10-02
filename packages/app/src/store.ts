import { $ID, $TYPE, $META, $OPTIONAL, $CONTEXT, $ARRAY } from "@ldkit/keys";
import { createResource } from "@ldkit/core";
import type { SchemaInterface } from "@ldkit/core";
import { createNamespace } from "@ldkit/namespaces";
import { dcterms, xsd, schema } from "@ldkit/namespaces";

import { namedNode } from "@ldkit/rdf";

import { createDefaultContext } from "@ldkit/engine";

import { Store } from "n3";
import { lastValueFrom } from "rxjs";

const TodoSchema = {
  [$TYPE]: schema.Thing,
  description: schema.description,
} as const;

export const store = new Store();

createDefaultContext(store);

export type TodosInterface = SchemaInterface<typeof TodoSchema>;

export const Todos = createResource(TodoSchema);

export const getRandomId = () =>
  `https://todos/${1000 + Math.floor(Math.random() * 1000)}`;
