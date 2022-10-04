import { braces, SparqlBuilder } from "./sparql_shared_builders.ts";

import { type RDF } from "../rdf.ts";
import { type SparqlValue } from "./sparql_tag.ts";

type Builders<T extends keyof SparqlUpdateBuilder> = Pick<
  SparqlUpdateBuilder,
  T
>;

class SparqlUpdateBuilder extends SparqlBuilder {
  public WHERE(
    strings: TemplateStringsArray,
    ...values: SparqlValue[]
  ): Builders<"build"> {
    return this.template(strings, values, "WHERE", braces);
  }

  public USING_NAMED(
    stringOrNamedNode: string | RDF.NamedNode<string>,
  ): Builders<"USING_NAMED" | "WHERE"> {
    return this.namedNode(stringOrNamedNode, "USING NAMED");
  }

  public USING(
    stringOrNamedNode: string | RDF.NamedNode<string>,
  ): Builders<"USING" | "USING_NAMED" | "WHERE"> {
    return this.namedNode(stringOrNamedNode, "USING");
  }

  public INSERT(
    strings: TemplateStringsArray,
    ...values: SparqlValue[]
  ): Builders<"USING" | "USING_NAMED" | "WHERE"> {
    return this.template(strings, values, "INSERT", braces);
  }

  public INSERT_DATA(
    strings: TemplateStringsArray,
    ...values: SparqlValue[]
  ): Builders<"build"> {
    return this.template(strings, values, "INSERT DATA", braces);
  }

  public DELETE(
    strings: TemplateStringsArray,
    ...values: SparqlValue[]
  ): Builders<"INSERT" | "USING" | "USING_NAMED" | "WHERE"> {
    return this.template(strings, values, "DELETE", braces);
  }

  public DELETE_DATA(
    strings: TemplateStringsArray,
    ...values: SparqlValue[]
  ): Builders<"build"> {
    return this.template(strings, values, "DELETE DATA", braces);
  }

  public WITH(
    stringOrNamedNode: string | RDF.NamedNode<string>,
  ): Builders<"INSERT" | "DELETE"> {
    return this.namedNode(stringOrNamedNode, "WITH");
  }
}

export const INSERT = Object.assign((
  strings: TemplateStringsArray,
  ...values: SparqlValue[]
) => new SparqlUpdateBuilder().INSERT(strings, values), {
  DATA: (
    strings: TemplateStringsArray,
    ...values: SparqlValue[]
  ) => new SparqlUpdateBuilder().INSERT_DATA(strings, values),
});

export const DELETE = Object.assign((
  strings: TemplateStringsArray,
  ...values: SparqlValue[]
) => new SparqlUpdateBuilder().DELETE(strings, values), {
  DATA: (
    strings: TemplateStringsArray,
    ...values: SparqlValue[]
  ) => new SparqlUpdateBuilder().DELETE_DATA(strings, values),
});

export const WITH = (
  stringOrNamedNode: string | RDF.NamedNode<string>,
) => new SparqlUpdateBuilder().WITH(stringOrNamedNode);
