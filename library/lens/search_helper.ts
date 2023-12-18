import { DataFactory, toRdf } from "../rdf.ts";
import { sparql as $, type SparqlValue } from "../sparql/mod.ts";
import { type Property, SearchSchema } from "../schema/mod.ts";
import xsd from "../namespaces/xsd.ts";

export class SearchHelper {
  private readonly property: Property;
  private readonly propertyType: string;
  private readonly varName: string;
  private readonly searchSchema: SearchSchema;

  private df: DataFactory = new DataFactory({
    blankNodePrefix: "b",
  });

  public readonly sparqlValues: SparqlValue[] = [];

  constructor(
    property: Property,
    varName: string,
    searchSchema: SearchSchema,
  ) {
    this.property = property;
    this.propertyType = property["@type"] ? property["@type"] : xsd.string;
    this.varName = varName;
    this.searchSchema = this.isPlainObject(searchSchema)
      ? searchSchema
      : { $equals: searchSchema };
  }

  public process() {
    this.processEquals();
  }

  private processEquals() {
    const value = this.searchSchema.$equals;
    if (value === undefined) {
      return;
    }

    this.sparqlValues.push(
      $`FILTER (${this.df.variable(this.varName)} = ${this.encode(value)}) .`,
    );
  }

  private encode(value: unknown) {
    return toRdf(value, {
      datatype: this.df.namedNode(this.propertyType),
    });
  }

  private isPlainObject(value: unknown) {
    if (typeof value !== "object" || value === null) {
      return false;
    }

    const prototype = Object.getPrototypeOf(value);
    return (prototype === null || prototype === Object.prototype ||
      Object.getPrototypeOf(prototype) === null) &&
      !(Symbol.toStringTag in value) && !(Symbol.iterator in value);
  }
}
