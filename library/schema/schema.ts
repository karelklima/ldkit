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

export type Property = {
  "@id": string;
  "@type"?: PropertyType;
  "@schema"?: Schema;
  "@optional"?: true;
  "@array"?: true;
  "@multilang"?: true;
  "@inverse"?: true;
};

export type Schema = {
  [key: string]: Property | string[];
  "@type": string[];
};
