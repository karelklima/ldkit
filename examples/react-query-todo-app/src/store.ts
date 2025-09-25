import { createLens, type Options, type SchemaInterface } from "ldkit";
import { QueryEngine as Comunica } from "@comunica/query-sparql-rdfjs";

import { N3 } from "ldkit/rdf";

import { todo, TodoItemSchema } from "../semantics/todo_schema";

export const store = new N3.Store();

const options: Options = {
  sources: [store],
  engine: new Comunica(),
  logQuery: (query) => console.log(query),
};

export type TodoInterface = SchemaInterface<typeof TodoItemSchema>;

export const Todos = createLens(TodoItemSchema, options);

export const getRandomId = () =>
  `${todo.$iri}${1000 + Math.floor(Math.random() * 1000)}`;

export const isDone = (item: TodoInterface) =>
  item.state === todo.TodoState_Done;

export const DONE = todo.TodoState_Done;
export const ACTIVE = todo.TodoState_Active;
