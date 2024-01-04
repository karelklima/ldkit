import type { SupportedDataTypes } from "./data_types.ts";

type PropertyType = keyof SupportedDataTypes;

export type Property = {
  "@id": string;
  "@type"?: PropertyType;
  "@schema"?: Schema;
  "@optional"?: true;
  "@array"?: true;
  "@multilang"?: true;
  "@inverse"?: true;
};

export type SchemaPrototypeProperties = {
  [key: string]: Property | string | readonly string[];
};

export type SchemaPrototypeType = {
  "@type"?: string | readonly string[];
};

export type Schema = SchemaPrototypeProperties & SchemaPrototypeType;

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
