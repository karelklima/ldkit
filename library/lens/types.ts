import type { Identity } from "../schema/mod.ts";

export type Entity<T extends unknown = Record<string, unknown>> =
  & DeepPartial<T>
  & Identity;

export type DeepPartial<T> = T extends Record<string, unknown>
  ? { [P in keyof T]?: DeepPartial<T[P]> }
  : T;

export type Unite<T> = T extends Record<string, unknown>
  ? { [Key in keyof T]: T[Key] }
  : T;
