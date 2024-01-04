import type { SupportedDataTypes } from "./data_types.ts";

type PropertyType = keyof SupportedDataTypes;

export type PropertyPrototype = {
  "@id": string;
  "@type"?: PropertyType;
  "@schema"?: SchemaPrototype;
  "@optional"?: true;
  "@array"?: true;
  "@multilang"?: true;
  "@inverse"?: true;
};

export type SchemaPrototypeProperties = {
  [key: string]: PropertyPrototype | string | readonly string[];
};

export type SchemaPrototypeType = {
  "@type"?: string | readonly string[];
};

export type SchemaPrototype = SchemaPrototypeProperties & SchemaPrototypeType;

export type ExpandedProperty = {
  "@id": string;
  "@type"?: PropertyType;
  "@schema"?: ExpandedSchema;
  "@optional"?: true;
  "@array"?: true;
  "@multilang"?: true;
  "@inverse"?: true;
};

export type ExpandedSchema = {
  [key: string]: ExpandedProperty | string[];
  "@type": string[];
};
