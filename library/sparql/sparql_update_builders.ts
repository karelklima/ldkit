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

  public DELETE_WHERE(
    strings: TemplateStringsArray,
    ...values: SparqlValue[]
  ): Builders<"build"> {
    return this.template(strings, values, "DELETE WHERE", braces);
  }

  public WITH(
    stringOrNamedNode: string | RDF.NamedNode<string>,
  ): Builders<"INSERT" | "DELETE"> {
    return this.namedNode(stringOrNamedNode, "WITH");
  }
}

/**
 * SPARQL INSERT query fluent interface
 *
 * @example
 * ```typescript
 * import { INSERT } from "ldkit/sparql";
 * import { foaf } from "ldkit/namespaces";
 * import { DataFactory } from "ldkit/rdf";
 *
 * const df = new DataFactory();
 * const firstName = df.namedNode(foaf.firstName);
 *
 * const query = INSERT`?person ${firstName} "Paul"`
 *   .WHERE`?person ${firstName} "Jean"`
 *   .build();
 * console.log(query);
 * // INSERT { ?person <http://xmlns.com/foaf/0.1/firstName> "Paul" }
 * // WHERE { ?person <http://xmlns.com/foaf/0.1/firstName> "Jean" }
 * ```
 */
export const INSERT = Object.assign((
  strings: TemplateStringsArray,
  ...values: SparqlValue[]
) => new SparqlUpdateBuilder().INSERT(strings, ...values), {
  DATA: (
    strings: TemplateStringsArray,
    ...values: SparqlValue[]
  ) => new SparqlUpdateBuilder().INSERT_DATA(strings, ...values),
});

/**
 * SPARQL DELETE query fluent interface
 *
 * @example
 * ```typescript
 * import { DELETE } from "ldkit/sparql";
 * import { foaf } from "ldkit/namespaces";
 * import { DataFactory } from "ldkit/rdf";
 *
 * const df = new DataFactory();
 * const firstName = df.namedNode(foaf.firstName);
 *
 * const query = DELETE`?person ${firstName} "Jean"`
 *   .INSERT`?person ${firstName} "Paul"`
 *   .WHERE`?person ${firstName} "Jean"`
 *   .build();
 * console.log(query);
 * // DELETE { ?person <http://xmlns.com/foaf/0.1/firstName> "Jean" }
 * // INSERT { ?person <http://xmlns.com/foaf/0.1/firstName> "Paul" }
 * // WHERE { ?person <http://xmlns.com/foaf/0.1/firstName> "Jean" }
 * ```
 */
export const DELETE = Object.assign((
  strings: TemplateStringsArray,
  ...values: SparqlValue[]
) => new SparqlUpdateBuilder().DELETE(strings, ...values), {
  DATA: (
    strings: TemplateStringsArray,
    ...values: SparqlValue[]
  ) => new SparqlUpdateBuilder().DELETE_DATA(strings, ...values),
  WHERE: (
    strings: TemplateStringsArray,
    ...values: SparqlValue[]
  ) => new SparqlUpdateBuilder().DELETE_WHERE(strings, ...values),
});

/**
 * SPARQL WITH query fluent interface
 *
 * @example
 * ```typescript
 * import { DELETE } from "ldkit/sparql";
 * import { foaf } from "ldkit/namespaces";
 * import { DataFactory } from "ldkit/rdf";
 *
 * const df = new DataFactory();
 * const firstName = df.namedNode(foaf.firstName);
 * const graph = df.namedNode("http://example.org/graph");
 *
 * const query = WITH(graph).DELETE`?person ${firstName} "Jean"`
 *   .INSERT`?person ${firstName} "Paul"`
 *   .WHERE`?person ${firstName} "Jean"`
 *   .build();
 * console.log(query);
 * // WITH <http://example.org/graph>
 * // DELETE { ?person <http://xmlns.com/foaf/0.1/firstName> "Jean" }
 * // INSERT { ?person <http://xmlns.com/foaf/0.1/firstName> "Paul" }
 * // WHERE { ?person <http://xmlns.com/foaf/0.1/firstName> "Jean" }
 * ```
 */
export const WITH = (
  stringOrNamedNode: string | RDF.NamedNode<string>,
) => new SparqlUpdateBuilder().WITH(stringOrNamedNode);
