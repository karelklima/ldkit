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

export type Schema = {
  "@type"?: string | readonly string[];
} & {
  [key: string]: Property | string | readonly string[];
};

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
