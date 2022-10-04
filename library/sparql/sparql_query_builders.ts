import {
  braces,
  parentheses,
  SparqlBuilder,
} from "./sparql_shared_builders.ts";

import { type RDF } from "../rdf.ts";
import { type SparqlValue } from "./sparql_tag.ts";

type Builders<T extends keyof SparqlQueryBuilder> = Pick<
  SparqlQueryBuilder,
  T
>;

class SparqlQueryBuilder extends SparqlBuilder {
  public OFFSET(
    number: number,
  ): Builders<"build"> {
    return this.number(number, "OFFSET");
  }

  public LIMIT(
    number: number,
  ): Builders<"build" | "OFFSET"> {
    return this.number(number, "LIMIT");
  }

  public ORDER_BY(
    strings: TemplateStringsArray,
    ...values: SparqlValue[]
  ): Builders<"build" | "LIMIT"> {
    return this.template(strings, values, "ORDER BY");
  }

  public HAVING(
    strings: TemplateStringsArray,
    ...values: SparqlValue[]
  ): Builders<"build" | "ORDER_BY" | "LIMIT"> {
    return this.template(strings, values, "HAVING", parentheses);
  }

  public GROUP_BY(
    strings: TemplateStringsArray,
    ...values: SparqlValue[]
  ): Builders<"build" | "HAVING" | "ORDER_BY" | "LIMIT"> {
    return this.template(strings, values, "GROUP BY");
  }

  public WHERE(
    strings: TemplateStringsArray,
    ...values: SparqlValue[]
  ): Builders<"build" | "GROUP_BY" | "ORDER_BY" | "LIMIT"> {
    return this.template(strings, values, "WHERE", braces);
  }

  public FROM_NAMED(
    stringOrNamedNode: string | RDF.NamedNode<string>,
  ): Builders<"FROM_NAMED" | "WHERE"> {
    return this.namedNode(stringOrNamedNode, "FROM NAMED");
  }

  public FROM(
    stringOrNamedNode: string | RDF.NamedNode<string>,
  ): Builders<"FROM" | "FROM_NAMED" | "WHERE"> {
    return this.namedNode(stringOrNamedNode, "FROM");
  }

  public SELECT(
    strings: TemplateStringsArray,
    ...values: SparqlValue[]
  ): Builders<"FROM" | "FROM_NAMED" | "WHERE"> {
    console.error("VALUES", values);
    return this.template(strings, values, "SELECT");
  }

  public SELECT_DISTINCT(
    strings: TemplateStringsArray,
    ...values: SparqlValue[]
  ): Builders<"FROM" | "FROM_NAMED" | "WHERE"> {
    return this.template(strings, values, "SELECT DISTINCT");
  }

  public SELECT_REDUCED(
    strings: TemplateStringsArray,
    ...values: SparqlValue[]
  ): Builders<"FROM" | "FROM_NAMED" | "WHERE"> {
    return this.template(strings, values, "SELECT REDUCED");
  }

  public CONSTRUCT(
    strings: TemplateStringsArray,
    ...values: SparqlValue[]
  ): Builders<"WHERE"> {
    return this.template(strings, values, "CONSTRUCT", braces);
  }

  public CONSTRUCT_WHERE(
    strings: TemplateStringsArray,
    ...values: SparqlValue[]
  ): Builders<"build" | "GROUP_BY" | "ORDER_BY" | "LIMIT"> {
    return this.template(strings, values, "CONSTRUCT WHERE", braces);
  }

  public ASK(
    strings: TemplateStringsArray,
    ...values: SparqlValue[]
  ): Builders<"build"> {
    return this.template(strings, values, "ASK", braces);
  }

  public ASK_FROM(
    stringOrNamedNode: string | RDF.NamedNode<string>,
  ): Builders<"FROM" | "FROM_NAMED" | "WHERE"> {
    return this.namedNode(stringOrNamedNode, "ASK\nFROM");
  }

  public ASK_FROM_NAMED(
    stringOrNamedNode: string | RDF.NamedNode<string>,
  ): Builders<"FROM_NAMED" | "WHERE"> {
    return this.namedNode(stringOrNamedNode, "ASK\nFROM NAMED");
  }

  public ASK_WHERE(
    strings: TemplateStringsArray,
    ...values: SparqlValue[]
  ): Builders<"build" | "GROUP_BY" | "ORDER_BY" | "LIMIT"> {
    return this.template(strings, values, "ASK\nWHERE", braces);
  }

  public DESCRIBE(
    strings: TemplateStringsArray,
    ...values: SparqlValue[]
  ): Builders<"build" | "FROM" | "FROM_NAMED" | "WHERE"> {
    return this.template(strings, values, "DESCRIBE");
  }
}

export const SELECT = Object.assign((
  strings: TemplateStringsArray,
  ...values: SparqlValue[]
) => new SparqlQueryBuilder().SELECT(strings, ...values), {
  DISTINCT: (
    strings: TemplateStringsArray,
    ...values: SparqlValue[]
  ) => new SparqlQueryBuilder().SELECT_DISTINCT(strings, ...values),
  REDUCED: (
    strings: TemplateStringsArray,
    ...values: SparqlValue[]
  ) => new SparqlQueryBuilder().SELECT_REDUCED(strings, ...values),
  get ALL() {
    return new SparqlQueryBuilder().SELECT`*`;
  },
});

export const CONSTRUCT = Object.assign((
  strings: TemplateStringsArray,
  ...values: SparqlValue[]
) => new SparqlQueryBuilder().CONSTRUCT(strings, ...values), {
  WHERE: (
    strings: TemplateStringsArray,
    ...values: SparqlValue[]
  ) => new SparqlQueryBuilder().CONSTRUCT_WHERE(strings, ...values),
});

export const ASK = Object.assign((
  strings: TemplateStringsArray,
  ...values: SparqlValue[]
) => new SparqlQueryBuilder().ASK(strings, ...values), {
  FROM: (
    stringOrNamedNode: string | RDF.NamedNode<string>,
  ) => new SparqlQueryBuilder().ASK_FROM(stringOrNamedNode),
  FROM_NAMED: (
    stringOrNamedNode: string | RDF.NamedNode<string>,
  ) => new SparqlQueryBuilder().ASK_FROM_NAMED(stringOrNamedNode),
  WHERE: (
    strings: TemplateStringsArray,
    ...values: SparqlValue[]
  ) => new SparqlQueryBuilder().ASK_WHERE(strings, ...values),
});

export const DESCRIBE = (
  strings: TemplateStringsArray,
  ...values: SparqlValue[]
) => new SparqlQueryBuilder().DESCRIBE(strings, ...values);
