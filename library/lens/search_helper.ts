import { DataFactory, toRdf } from "../rdf.ts";
import { sparql as $, type SparqlValue } from "../sparql/mod.ts";
import { type ExpandedProperty, type SearchSchema } from "../schema/mod.ts";
import xsd from "../namespaces/xsd.ts";

export class SearchHelper {
  private readonly property: ExpandedProperty;
  private readonly propertyType: string;
  private readonly varName: string;
  private readonly searchSchema: SearchSchema;

  private df: DataFactory = new DataFactory({
    blankNodePrefix: "b",
  });

  public readonly sparqlValues: SparqlValue[] = [];

  constructor(
    property: ExpandedProperty,
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
    this.processOperators();
    this.processStringFunctions();
    this.processRegex();
    this.processLangMatches();
    this.processFilter();
  }

  private processOperators() {
    const map = {
      $equals: "=",
      $not: "!=",
      $gt: ">",
      $gte: ">=",
      $lt: "<",
      $lte: "<=",
    };

    for (const [key, operator] of Object.entries(map)) {
      const value = this.searchSchema[key];
      if (value === undefined) {
        continue;
      }

      this.addFilter(
        $`${this.df.variable(this.varName)} ${operator} ${this.encode(value)}`,
      );
    }
  }

  private processStringFunctions() {
    const map = {
      $contains: "CONTAINS",
      $strStarts: "STRSTARTS",
      $strEnds: "STRENDS",
    };

    for (const [key, func] of Object.entries(map)) {
      const value = this.searchSchema[key];
      if (value === undefined) {
        continue;
      }

      this.addFilter(
        $`${func}(${this.df.variable(this.varName)}, ${this.encode(value)})`,
      );
    }
  }

  private processRegex() {
    const value = this.searchSchema.$regex;
    if (value === undefined) {
      return;
    }

    this.addFilter(
      $`REGEX(${this.df.variable(this.varName)}, "${value as string}")`,
    );
  }

  private processLangMatches() {
    const value = this.searchSchema.$langMatches;
    if (value === undefined) {
      return;
    }

    this.addFilter(
      $`LANGMATCHES(LANG(${
        this.df.variable(this.varName)
      }), "${value as string}")`,
    );
  }

  private processFilter() {
    const value = this.searchSchema.$filter;
    if (value === undefined) {
      return;
    }
    const stringified = $`${value as SparqlValue}`;
    this.addFilter(stringified.replace("?value", `?${this.varName}`));
  }

  private addFilter(filter: SparqlValue) {
    this.sparqlValues.push($`FILTER (${filter}) .`);
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
