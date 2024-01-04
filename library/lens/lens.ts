import type { Graph, Iri, RDF } from "../rdf.ts";
import {
  type Options,
  resolveOptions,
  resolveQueryContext,
} from "../options.ts";
import {
  type ExpandedSchema,
  expandSchema,
  type Schema,
  type SchemaInterface,
  type SchemaInterfaceIdentity,
  type SchemaSearchInterface,
  type SchemaUpdateInterface,
} from "../schema/mod.ts";
import { decode } from "../decoder.ts";

import { QueryBuilder } from "./query_builder.ts";
import type { Entity, Unite } from "./types.ts";
import { QueryEngineProxy } from "../engine/query_engine_proxy.ts";

/**
 * Lens lets you query and update RDF data via data schema using TypeScript native data types.
 *
 * https://ldkit.io/docs/components/lens
 *
 * @param schema data schema which extends `SchemaPrototype`
 * @param options optional `Options` - contains LDkit and query engine configuration
 * @returns Lens instance
 */
export const createLens = <T extends Schema>(
  schema: T,
  options: Options = {},
) => new Lens(schema, options);

export class Lens<
  S extends Schema,
  I = SchemaInterface<S>,
  U = SchemaUpdateInterface<S>,
  X = SchemaSearchInterface<S>,
> {
  private readonly schema: ExpandedSchema;
  private readonly options: Options;
  private readonly engine: QueryEngineProxy;
  private readonly queryBuilder: QueryBuilder;

  constructor(schema: S, options?: Options) {
    this.schema = expandSchema(schema);
    this.options = resolveOptions(options);
    const context = resolveQueryContext(this.options);
    this.engine = new QueryEngineProxy(this.options.engine!, context);
    this.queryBuilder = new QueryBuilder(this.schema, this.options);
  }

  private decode(graph: Graph) {
    return decode(graph, this.schema, this.options) as unknown as Unite<I>[];
  }

  private log(query: string) {
    this.options.logQuery!(query);
  }

  async count() {
    const q = this.queryBuilder.countQuery();
    this.log(q);
    const bindings = await this.engine.queryBindings(q);
    return parseInt(bindings[0].get("count")!.value);
  }

  async query(sparqlConstructQuery: string) {
    this.log(sparqlConstructQuery);
    const graph = await this.engine.queryGraph(sparqlConstructQuery);
    return this.decode(graph);
  }

  async find(
    options: { where?: X | string | RDF.Quad[]; take?: number; skip?: number } =
      {},
  ) {
    const { where, take, skip } = {
      take: this.options.take!,
      skip: 0,
      ...options,
    };
    const isRegularQuery = typeof where === "string" ||
      typeof where === "undefined" || Array.isArray(where);

    const q = isRegularQuery
      ? this.queryBuilder.getQuery(where, take, skip)
      : this.queryBuilder.getSearchQuery(where ?? {}, take, skip);
    this.log(q);
    const graph = await this.engine.queryGraph(q);
    return this.decode(graph);
  }

  async findByIri(iri: Iri) {
    const results = await this.findByIris([iri]);
    return results.length > 0 ? results[0] : null;
  }

  async findByIris(iris: Iri[]) {
    const q = this.queryBuilder.getByIrisQuery(iris);
    this.log(q);
    const graph = await this.engine.queryGraph(q);
    return this.decode(graph);
  }

  private updateQuery(query: string) {
    this.log(query);
    return this.engine.queryVoid(query);
  }

  insert(...entities: Entity<I>[]) {
    const q = this.queryBuilder.insertQuery(entities);
    return this.updateQuery(q);
  }

  insertData(...quads: RDF.Quad[]) {
    const q = this.queryBuilder.insertDataQuery(quads);
    return this.updateQuery(q);
  }

  update(...entities: U[]) {
    const q = this.queryBuilder.updateQuery(entities as Entity[]);
    return this.updateQuery(q);
  }

  delete(...identities: SchemaInterfaceIdentity[] | Iri[]) {
    const iris = identities.map((identity) => {
      return typeof identity === "string" ? identity : identity.$id;
    });

    const q = this.queryBuilder.deleteQuery(iris);
    return this.updateQuery(q);
  }

  deleteData(...quads: RDF.Quad[]) {
    const q = this.queryBuilder.deleteDataQuery(quads);
    return this.updateQuery(q);
  }
}
