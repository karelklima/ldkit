import { createNamespace, ldkit, xsd } from "ldkit/namespaces";

export const todo = createNamespace(
  {
    iri: "https://example.com/todo/",
    prefix: "todo:",
    terms: [
      "TodoItem",
      "TodoState",
      "TodoState_Active",
      "TodoState_Done",
      "description",
      "state",
      "dueDate",
    ],
  } as const,
);

export const TodoStateSchema = {
  "@type": todo.TodoState,
} as const;

export const TodoItemSchema = {
  "@type": todo.TodoItem,
  description: todo.description,
  state: {
    "@id": todo.state,
    "@type": ldkit.IRI,
  },
  dueDate: {
    "@id": todo.dueDate,
    "@type": xsd.dateTime,
    "@optional": true,
  },
} as const;
