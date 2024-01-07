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

/**
 * SPARQL OPTIONAL expression fluent interface
 *
 * @example
 * ```typescript
 * import { OPTIONAL } from "ldkit/sparql";
 *
 * const query = OPTIONAL`?s ?p ?o`.build();
 * console.log(query); // OPTIONAL { ?s ?p ?o }
 * ```
 */
export const OPTIONAL = (
  strings: TemplateStringsArray,
  ...values: SparqlValue[]
) => new SparqlExpressionBuilder().OPTIONAL(strings, ...values);
