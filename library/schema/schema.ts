import type { SupportedDataTypes } from "./data_types.ts";

/**
 * Data property prototype that describes RDF predicate of a data entity.
 * Includes specification of other metadata, such as whether the property
 * is optional, array, inverse, or whether it is a nested data entity, etc.
 */
export type Property = {
  "@id": string;
  "@type"?: keyof SupportedDataTypes;
  "@schema"?: Schema;
  "@optional"?: true;
  "@array"?: true;
  "@multilang"?: true;
  "@inverse"?: true;
};

/**
 * Data schema prototype that describes a data entity. Includes an optional
 * specification of RDF type and a map of RDF properties.
 */
export type Schema = {
  "@type"?: string | readonly string[];
} & {
  [key: string]: Property | string | readonly string[];
};

export type ExpandedProperty = {
  "@id": string;
  "@type"?: keyof SupportedDataTypes;
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
