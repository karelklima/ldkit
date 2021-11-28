import { xsd } from "@ldkit/namespaces";
import type {
  Property,
  SchemaInterfaceIdentity,
  SchemaInterfaceType,
} from "@ldkit/schema";

export type Entity<T extends any = Record<string, any>> = DeepPartial<T> &
  SchemaInterfaceIdentity;

export type DeepPartial<T> = T extends Function
  ? T
  : T extends object
  ? { [P in keyof T]?: DeepPartial<T[P]> }
  : T;
