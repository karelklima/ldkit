import type { SupportedDataTypes } from "./data-types";

type Meta = "@optional" | "@array" | "@lazy";

type PropertyType = keyof SupportedDataTypes;

export type PropertyPrototype = {
  "@id": string;
  "@type"?: PropertyType;
  "@meta"?: Meta | readonly Meta[];
  "@context"?: SchemaPrototype;
};

export type SchemaPrototypeProperties = {
  [key: string]: PropertyPrototype | string | readonly string[];
};

export type SchemaPrototypeType = {
  "@type": string | readonly string[];
};

export type SchemaPrototype = SchemaPrototypeProperties & SchemaPrototypeType;

export type Property = {
  "@id": string;
  "@type"?: PropertyType;
  "@meta": Meta[];
  "@context"?: Schema;
};

export type Schema = {
  [key: string]: Property | string[];
  "@type": string[];
};
