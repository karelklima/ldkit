import { DataFactory, type RDF } from "../rdf.ts";
import xsd from "../namespaces/xsd.ts";

import { stringify } from "./stringify.ts";

type SparqlValue =
  | RDF.Term
  | string
  | number
  | boolean
  | Date
  | null
  | undefined;

export const sparql = (
  strings: TemplateStringsArray,
  ...values: SparqlValue[]
) => {
  let counter = 0;
  let result = "";

  for (const value of values) {
    result += strings[counter++];

    result += valueToString(value);
  }

  result += strings[counter];

  return result;
};

const df = new DataFactory();

const valueToString = (value: SparqlValue): string => {
  if (typeof value === "undefined" || value === null) {
    return "";
  }

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number") {
    const numberDataType = Number.isInteger(value) ? xsd.integer : xsd.decimal;
    return stringify(df.literal(value.toString(), numberDataType));
  }
  if (typeof value === "boolean") {
    return stringify(df.literal(value.toString(), xsd.boolean));
  }
  if (value instanceof Date) {
    return stringify(df.literal(value.toISOString(), xsd.dateTime));
  }

  if (value.termType) {
    return stringify(value);
  }

  throw new Error("Not supported input type detected.");
};
