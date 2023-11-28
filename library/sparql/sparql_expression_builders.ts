import { bracesInline, SparqlBuilder } from "./sparql_shared_builders.ts";

import { type SparqlValue } from "./sparql_tag.ts";

type Builders<T extends keyof SparqlExpressionBuilder> = Pick<
  SparqlExpressionBuilder,
  T
>;

class SparqlExpressionBuilder extends SparqlBuilder {
  public OPTIONAL(
    strings: TemplateStringsArray,
    ...values: SparqlValue[]
  ): Builders<"build"> {
    return this.template(strings, values, "OPTIONAL", bracesInline);
  }
}

export const OPTIONAL = (
  strings: TemplateStringsArray,
  ...values: SparqlValue[]
) => new SparqlExpressionBuilder().OPTIONAL(strings, ...values);
