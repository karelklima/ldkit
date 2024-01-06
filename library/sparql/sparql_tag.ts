import { DataFactory, type RDF } from "../rdf.ts";
import { xsd } from "../../namespaces/xsd.ts";

import { stringify } from "./stringify.ts";

export type SparqlValue =
  | RDF.Term
  | string
  | number
  | boolean
  | Date
  | Iterable<SparqlValue>
  | { build: () => string }
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

const isIterable = (obj: unknown): obj is Iterable<unknown> => {
  return Symbol.iterator in Object(obj);
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
    return stringify(
      df.literal(value.toString(), df.namedNode(numberDataType)),
    );
  }
  if (typeof value === "boolean") {
    return stringify(df.literal(value.toString(), df.namedNode(xsd.boolean)));
  }
  if (value instanceof Date) {
    return stringify(
      df.literal(value.toISOString(), df.namedNode(xsd.dateTime)),
    );
  }

  if (isIterable(value)) {
    const [first, ...rest] = value;
    let result = valueToString(first);

    for (const part of rest) {
      result += `\n${valueToString(part)}`;
    }
    return result;
  }

  if ("build" in value) {
    return value.build();
  }

  if (value.termType) {
    return stringify(value);
  }

  throw new Error("Not supported input type detected.");
};
