import type { SupportedDataTypes } from "./data_types.ts";
import type { Property, Schema } from "./schema.ts";
import type { SearchFilters } from "./search.ts";

type Unite<T> = T extends Record<string, unknown> ? { [Key in keyof T]: T[Key] }
  : T;

type IsOptional<T extends Property> = T extends {
  "@optional": true;
} ? true
  : false;

type IsArray<T extends Property> = T extends {
  "@array": true;
} ? true
  : false;

type IsMultilang<T extends Property> = T extends {
  "@multilang": true;
} ? true
  : false;

type IsInverse<T extends Property> = T extends {
  "@inverse": true;
} ? true
  : false;

type ValidPropertyDefinition = Property | string;

type ConvertPropertyType<T extends Property> = T extends { "@type": unknown }
  ? T["@type"] extends keyof SupportedDataTypes
    // type is built-int
    ? SupportedDataTypes[T["@type"]]
    // type is invalid
  : never
  // no type -> defaults to string
  : string;

type ConvertPropertySchema<T extends Property> = T extends { "@schema": Schema }
  ? Unite<SchemaInterface<T["@schema"]>>
  : ConvertPropertyType<T>;

type ConvertPropertyOptional<T extends Property> = IsOptional<T> extends true
  ? ConvertPropertySchema<T> | null
  : ConvertPropertySchema<T>;

type ConvertPropertyArray<T extends Property> = IsArray<T> extends true
  ? ConvertPropertySchema<T>[]
  : ConvertPropertyOptional<T>;

type ConvertPropertyMultilang<T extends Property> = IsMultilang<T> extends true
  ? IsArray<T> extends true ? Record<string, ConvertPropertyType<T>[]>
  : Record<string, ConvertPropertyType<T>>
  : ConvertPropertyArray<T>;

type ConvertPropertyObject<T extends Property> = ConvertPropertyMultilang<T>;

type ConvertProperty<T extends ValidPropertyDefinition> = T extends Property
  ? ConvertPropertyObject<T>
  : string;

export type Identity = {
  $id: string;
};

export type SchemaInterface<T extends Schema> =
  & Identity
  & {
    [X in Exclude<keyof T, "@type">]: T[X] extends ValidPropertyDefinition
      ? ConvertProperty<T[X]>
      : never;
  };

type ConvertUpdatePropertySchema<T extends Property> = T extends
  { "@schema": Schema } ? Unite<SchemaUpdateInterface<T["@schema"]>>
  : ConvertPropertyType<T>;

type ConvertUpdatePropertyOptional<T extends Property> = IsOptional<T> extends
  true ? ConvertPropertySchema<T> | null
  : ConvertUpdatePropertySchema<T>;

type CreateArrayUpdateInterface<T extends Property> = {
  $set?: ConvertPropertyType<T>[];
  $add?: ConvertPropertyType<T>[];
  $remove?: ConvertPropertyType<T>[];
} | ConvertPropertyType<T>[];

type ConvertUpdatePropertyArray<T extends Property> = IsArray<T> extends true
  ? CreateArrayUpdateInterface<T>
  : ConvertUpdatePropertyOptional<T>;

type ConvertUpdatePropertyMultilang<T extends Property> = IsMultilang<T> extends
  true ? IsArray<T> extends true ? Record<string, CreateArrayUpdateInterface<T>>
  : Record<string, ConvertPropertyType<T>>
  : ConvertUpdatePropertyArray<T>;

type ConvertUpdatePropertyObject<T extends Property> =
  ConvertUpdatePropertyMultilang<T>;

type ConvertUpdateProperty<T extends ValidPropertyDefinition> = T extends
  Property ? ConvertUpdatePropertyObject<T> : string;

export type SchemaUpdateInterface<T extends Schema> =
  & Identity
  & {
    [X in Exclude<keyof T, "@type">]?: T[X] extends ValidPropertyDefinition
      ? ConvertUpdateProperty<T[X]>
      : never;
  };

type ConvertSearchPropertySchema<T extends Property> = T extends
  { "@schema": Schema } ? Unite<SchemaSearchInterface<T["@schema"]>>
  : IsInverse<T> extends true ? never
  : SearchFilters<ConvertPropertyType<T>>;

type ConvertSearchProperty<T extends ValidPropertyDefinition> = T extends
  Property ? ConvertSearchPropertySchema<T>
  : SearchFilters<string>;

type InversePropertiesMap<T extends Schema> = {
  [X in keyof T]: T[X] extends { "@inverse": true } ? X : never;
};

type InverseProperties<T extends Schema> = InversePropertiesMap<
  T
>[keyof InversePropertiesMap<T>];

export type SchemaSearchInterface<T extends Schema> = {
  [X in Exclude<keyof T, "@type" | InverseProperties<T>>]?: T[X] extends
    ValidPropertyDefinition ? ConvertSearchProperty<T[X]>
    : never;
};
