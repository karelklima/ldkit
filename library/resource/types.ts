import { xsd } from "../namespaces/mod.ts";
import type {
  Property,
  SchemaInterfaceIdentity,
  SchemaInterfaceType,
} from "../schema/mod.ts";

export type Entity<T extends any = Record<string, any>> = DeepPartial<T> &
  SchemaInterfaceIdentity;

export type DeepPartial<T> = T extends Function
  ? T
  : T extends object
  ? { [P in keyof T]?: DeepPartial<T[P]> }
  : T;
