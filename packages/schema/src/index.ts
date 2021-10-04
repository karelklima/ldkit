export type {
  SchemaInterface,
  SchemaInterfaceIdentity,
  SchemaInterfaceType,
} from "./interface";

import type {
  Schema,
  SchemaPrototype,
  Property,
  PropertyPrototype,
} from "./schema";
export { Schema, SchemaPrototype, Property, PropertyPrototype };

export { expandSchema, getSchemaProperties } from "./utils";
