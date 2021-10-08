import type { SupportedDataTypes } from "./data-types";
import type { SchemaPrototype, PropertyPrototype } from "./schema";

type ReadonlyArrayValues<T> = T extends Readonly<Array<infer R>> ? R : never;

type HasMetaValue<MetaType, ValueType> =
  ValueType extends ReadonlyArrayValues<MetaType>
    ? true
    : MetaType extends ValueType
    ? true
    : false;

type IsOptional<Property extends PropertyPrototype> = HasMetaValue<
  Property["@meta"],
  "@optional"
>;

type IsArray<Property extends PropertyPrototype> = HasMetaValue<
  Property["@meta"],
  "@array"
>;

type ValidPropertyDefinition = PropertyPrototype | string;

type ConvertPropertyType<T extends PropertyPrototype> = T extends {
  "@context": SchemaPrototype;
}
  ? // embedded schema
    SchemaInterface<T["@context"]>
  : // type specified
  T extends { "@type": any }
  ? T["@type"] extends keyof SupportedDataTypes
    ? // type is built-int
      SupportedDataTypes[T["@type"]]
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

export type SchemaInterfaceIdentity = {
  "@id": string;
};

export type SchemaInterfaceType = {
  "@type": string[];
};

export type SchemaInterface<T extends SchemaPrototype> = Omit<
  {
    [X in keyof T]: T[X] extends ValidPropertyDefinition
      ? ConvertProperty<T[X]>
      : never;
  },
  "@type" | "@id"
> &
  SchemaInterfaceIdentity &
  SchemaInterfaceType;
