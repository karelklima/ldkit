import { DataFactory, RDF } from "../rdf.ts";
import { sparql, type SparqlValue } from "./sparql_tag.ts";

type TTemplateBuilder = (
  strings: TemplateStringsArray,
  ...values: SparqlValue[]
) => TBuilderCollection;

type TNumericBuilder = (number: number) => TBuilderCollection;

type TNamedNodeBuilder = (
  stringOrNamedNode: string | RDF.NamedNode,
) => TBuilderCollection;

type TTerminalBuilder = () => string;

type TBuilder =
  | TTemplateBuilder
  | TNumericBuilder
  | TNamedNodeBuilder
  | TTerminalBuilder;

type TBuilderCollection = Record<string, TBuilder>;

type This = { $partialQuery: string } | undefined;

const createContext = (
  self: This,
  current: string,
  builders: TBuilderCollection,
) => {
  const previousQuery = self?.$partialQuery || "";
  const context: This = { $partialQuery: previousQuery + current };
  return Object.keys(builders).reduce((acc, key) => {
    acc[key] = builders[key].bind(context);
    return acc;
  }, {} as TBuilderCollection);
};

export const createTemplateBuilder = <
  TReturnType extends TBuilderCollection,
>(
  wrap: (value: string) => string,
  builders: TReturnType,
) => {
  return function (
    this: unknown,
    strings: TemplateStringsArray,
    ...values: SparqlValue[]
  ) {
    const self = (this as This);
    const inner = sparql(strings, ...values);
    const current = wrap(inner);
    return createContext(self, current, builders) as TReturnType;
  };
};

export const createNumericBuilder = <
  TReturnType extends TBuilderCollection,
>(
  wrap: (value: number) => string,
  builders: TReturnType,
) => {
  return function (
    this: unknown,
    number: number,
  ) {
    const self = (this as This);
    const current = wrap(number);
    return createContext(self, current, builders) as TReturnType;
  };
};

const df = new DataFactory();

export const createNamedNodeBuilder = <
  TReturnType extends TBuilderCollection,
>(
  wrap: (value: string) => string,
  builders: TReturnType,
) => {
  return function (
    this: unknown,
    stringOrNamedNode: string | RDF.NamedNode,
  ) {
    const self = (this as This);
    const namedNode = typeof stringOrNamedNode === "string"
      ? df.namedNode(stringOrNamedNode)
      : stringOrNamedNode;
    const inner = sparql`${namedNode}`;
    const current = wrap(inner);
    return createContext(self, current, builders) as TReturnType;
  };
};

export const build = function (this: unknown): string {
  return (this as This)?.$partialQuery || "";
};
