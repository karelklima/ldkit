import type { SupportedDataTypes } from "./data_types.ts";
import type { PropertyPrototype, SchemaPrototype } from "./schema.ts";

type Prettify<T> =
  & {
    [K in keyof T]: T[K];
  }
  // deno-lint-ignore ban-types
  & {};

type IsOptional<Property extends PropertyPrototype> = Property extends {
  "@optional": true;
} ? true
  : false;

type IsArray<Property extends PropertyPrototype> = Property extends {
  "@array": true;
} ? true
  : false;

type IsMultilang<Property extends PropertyPrototype> = Property extends {
  "@multilang": true;
} ? true
  : false;

type ValidPropertyDefinition = PropertyPrototype | string;

type ConvertPropertyType<T extends PropertyPrototype> = T extends
  { "@type": unknown } ? T["@type"] extends keyof SupportedDataTypes
    // type is built-int
    ? SupportedDataTypes[T["@type"]]
    // type is invalid
  : never
  // no type -> defaults to string
  : string;

type ConvertPropertyContext<T extends PropertyPrototype> = T extends
  { "@context": SchemaPrototype } ? SchemaInterface<T["@context"]>
  : ConvertPropertyType<T>;

type ConvertPropertyOptional<T extends PropertyPrototype> =
  IsOptional<T> extends true ? ConvertPropertyContext<T> | null
    : ConvertPropertyContext<T>;

type ConvertPropertyArray<T extends PropertyPrototype> = IsArray<T> extends true
  ? ConvertPropertyContext<T>[]
  : ConvertPropertyOptional<T>;

type ConvertPropertyMultilang<T extends PropertyPrototype> =
  IsMultilang<T> extends true
    ? IsArray<T> extends true ? Record<string, ConvertPropertyType<T>[]>
    : Record<string, ConvertPropertyType<T>>
    : ConvertPropertyArray<T>;

type ConvertPropertyObject<T extends PropertyPrototype> =
  ConvertPropertyMultilang<T>;

type ConvertProperty<T extends ValidPropertyDefinition> = T extends
  PropertyPrototype ? ConvertPropertyObject<T> : string;

export type SchemaInterfaceIdentity = {
  $id: string;
};

export type SchemaInterfaceType = {
  $type: string[];
};

export type SchemaInterface<T extends SchemaPrototype> =
  & SchemaInterfaceIdentity
  & {
    [X in Exclude<keyof T, "@type">]: T[X] extends ValidPropertyDefinition
      ? Prettify<ConvertProperty<T[X]>>
      : never;
  };

type ConvertUpdatePropertyContext<T extends PropertyPrototype> = T extends
  { "@context": SchemaPrototype } ? SchemaUpdateInterface<T["@context"]>
  : ConvertPropertyType<T>;

type ConvertUpdatePropertyOptional<T extends PropertyPrototype> =
  IsOptional<T> extends true ? ConvertPropertyContext<T> | null
    : ConvertUpdatePropertyContext<T>;

type CreateArrayUpdateInterface<T extends PropertyPrototype> = {
  $set?: ConvertPropertyType<T>[];
  $add?: ConvertPropertyType<T> | ConvertPropertyType<T>[];
  $remove?: ConvertPropertyType<T> | ConvertPropertyType<T>[];
} | ConvertPropertyType<T>[];

type ConvertUpdatePropertyArray<T extends PropertyPrototype> =
  IsArray<T> extends true ? CreateArrayUpdateInterface<T>
    : ConvertUpdatePropertyOptional<T>;

type ConvertUpdatePropertyMultilang<T extends PropertyPrototype> =
  IsMultilang<T> extends true
    ? IsArray<T> extends true ? Record<string, CreateArrayUpdateInterface<T>>
    : Record<string, ConvertPropertyType<T>>
    : ConvertUpdatePropertyArray<T>;

type ConvertUpdatePropertyObject<T extends PropertyPrototype> =
  ConvertUpdatePropertyMultilang<T>;

type ConvertUpdateProperty<T extends ValidPropertyDefinition> = T extends
  PropertyPrototype ? ConvertUpdatePropertyObject<T> : string;

export type SchemaUpdateInterface<T extends SchemaPrototype> = Prettify<
  & SchemaInterfaceIdentity
  & {
    [X in Exclude<keyof T, "@type">]?: T[X] extends ValidPropertyDefinition
      ? ConvertUpdateProperty<T[X]>
      : never;
  }
>;
