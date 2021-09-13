export type { SchemaInterface } from "./interface";

import type {
  Schema,
  SchemaPrototype,
  Property,
  PropertyPrototype,
} from "./schema";
export { Schema, SchemaPrototype, Property, PropertyPrototype };

export * from "./keys";

export { expandSchema, getSchemaProperties } from "./utils";
