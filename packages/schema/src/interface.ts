import type { SupportedDataTypes } from "./data-types";
import { $ARRAY, $CONTEXT, $META, $OPTIONAL, $TYPE, $ID } from "./keys";
import type { SchemaPrototype, PropertyPrototype } from "./schema";

type ReadonlyArrayValues<T> = T extends Readonly<Array<infer R>> ? R : never;

type HasMetaValue<MetaType, ValueType> =
  ValueType extends ReadonlyArrayValues<MetaType> ? true : false;

type IsOptional<Property extends PropertyPrototype> = HasMetaValue<
  Property[typeof $META],
  typeof $OPTIONAL
>;

type IsArray<Property extends PropertyPrototype> = HasMetaValue<
  Property[typeof $META],
  typeof $ARRAY
>;

type ValidPropertyDefinition = PropertyPrototype | string;

type ConvertPropertyType<T extends PropertyPrototype> = T extends {
  [$CONTEXT]: SchemaPrototype;
}
  ? // embedded schema
    SchemaInterface<T[typeof $CONTEXT]>
  : // type specified
  T extends { [$TYPE]: any }
  ? T[typeof $TYPE] extends keyof SupportedDataTypes
    ? // type is built-int
      SupportedDataTypes[T[typeof $TYPE]]
    : // type is invalid
      never
  : // no type -> defaults to string
    string;

type ConvertPropertyOptional<T extends PropertyPrototype> =
  IsOptional<T> extends true
    ? ConvertPropertyType<T> | undefined
    : ConvertPropertyType<T>;

type ConvertPropertyArray<T extends PropertyPrototype> = IsArray<T> extends true
  ? ConvertPropertyType<T>[]
  : ConvertPropertyOptional<T>;

type ConvertPropertyObject<T extends PropertyPrototype> =
  ConvertPropertyArray<T>;

type ConvertProperty<T extends ValidPropertyDefinition> =
  T extends PropertyPrototype ? ConvertPropertyObject<T> : string;

export type SchemaInterface<T extends SchemaPrototype> = Omit<
  {
    [X in keyof T]: T[X] extends ValidPropertyDefinition
      ? ConvertProperty<T[X]>
      : never;
  },
  typeof $TYPE
> & { [$ID]: string };
