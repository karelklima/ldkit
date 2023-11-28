import { DataFactory, RDF } from "../rdf.ts";
import { sparql, type SparqlValue } from "./sparql_tag.ts";

type Wrap = (keyword: string, value: string) => string;
export const braces: Wrap = (keyword: string, value: string) =>
  `${keyword} {\n${value}\n}\n`;
export const bracesInline: Wrap = (keyword: string, value: string) =>
  `${keyword} { ${value} }`;
export const parentheses: Wrap = (keyword: string, value: string) =>
  `${keyword} (${value})\n`;
const none: Wrap = (keyword: string, value: string) => `${keyword} ${value}\n`;

export abstract class SparqlBuilder {
  protected value = "";
  protected dataFactory = new DataFactory();

  public build() {
    return this.value;
  }

  private sparql(
    strings: TemplateStringsArray,
    ...values: SparqlValue[]
  ) {
    return !values || values.length < 1
      ? sparql(strings)
      : sparql(strings, ...values);
  }

  protected template(
    strings: TemplateStringsArray,
    values: SparqlValue[],
    keyword: string,
    wrap: Wrap = none,
  ) {
    const inputSparql = this.sparql(strings, ...values);
    this.value += wrap(keyword, inputSparql);
    return this;
  }

  protected namedNode(
    stringOrNamedNode: string | RDF.NamedNode<string>,
    keyword: string,
    wrap: Wrap = none,
  ) {
    const namedNode = typeof stringOrNamedNode === "string"
      ? this.dataFactory.namedNode(stringOrNamedNode)
      : stringOrNamedNode;
    const inputSparql = this.sparql`${namedNode}`;
    this.value += wrap(keyword, inputSparql);
    return this;
  }

  protected number(
    number: number,
    keyword: string,
    wrap: Wrap = none,
  ) {
    this.value += wrap(keyword, number.toString());
    return this;
  }
}
