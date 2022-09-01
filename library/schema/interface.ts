import type { SupportedDataTypes } from "./data_types.ts";
import type { SchemaPrototype, PropertyPrototype } from "./schema.ts";

type IsOptional<Property extends PropertyPrototype> = Property extends {
  "@optional": true;
}
  ? true
  : false;

type IsArray<Property extends PropertyPrototype> = Property extends {
  "@array": true;
}
  ? true
  : false;

type IsMultilang<Property extends PropertyPrototype> = Property extends {
  "@multilang": true;
}
  ? true
  : false;

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

type ConvertPropertyMultilang<T extends PropertyPrototype> =
  IsMultilang<T> extends true
    ? IsArray<T> extends true
      ? Record<string, ConvertPropertyType<T>[]>
      : Record<string, ConvertPropertyType<T>>
    : ConvertPropertyArray<T>;

type ConvertPropertyObject<T extends PropertyPrototype> =
  ConvertPropertyMultilang<T>;

type ConvertProperty<T extends ValidPropertyDefinition> =
  T extends PropertyPrototype ? ConvertPropertyObject<T> : string;

export type SchemaInterfaceIdentity = {
  $id: string;
};

export type SchemaInterfaceType = {
  $type: string[];
};

export type SchemaInterface<T extends SchemaPrototype> = {
  [X in Exclude<keyof T, "@type">]: T[X] extends ValidPropertyDefinition
    ? ConvertProperty<T[X]>
    : never;
} & SchemaInterfaceIdentity &
  SchemaInterfaceType;
