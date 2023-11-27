import type { Context, Graph, IQueryEngine, Iri, RDF } from "../rdf.ts";
import { resolveContext } from "../global.ts";
import {
  expandSchema,
  type Schema,
  type SchemaInterface,
  type SchemaInterfaceIdentity,
  type SchemaPrototype,
  type SchemaUpdateInterface,
} from "../schema/mod.ts";
import { decode } from "../decoder.ts";

import { QueryBuilder } from "./query_builder.ts";
import type { Entity } from "./types.ts";
import { QueryEngineProxy } from "../engine/query_engine_proxy.ts";

/**
 * Lens lets you query and update RDF data via data schema using TypeScript native data types.
 *
 * https://ldkit.io/docs/components/lens
 *
 * @param schema data schema which extends `SchemaPrototype`
 * @param context optional `Context` - contains LDkit and query engine configuration
 * @param engine optional Query Engine
 * @returns Lens instance
 */
export const createLens = <T extends SchemaPrototype>(
  schema: T,
  context?: Context,
  engine?: IQueryEngine,
) => new Lens(schema, context, engine);

/**
 * @deprecated
 * Use `createLens` instead
 */
export const createResource = <T extends SchemaPrototype>(
  schema: T,
  context?: Context,
  engine?: IQueryEngine,
) => new Lens(schema, context, engine);

export class Lens<
  S extends SchemaPrototype,
  I = SchemaInterface<S>,
  U = SchemaUpdateInterface<S>,
> {
  private readonly schema: Schema;
  private readonly context: Context;
  private readonly engine: QueryEngineProxy;
  private readonly queryBuilder: QueryBuilder;

  constructor(schema: S, context?: Context, engine?: IQueryEngine) {
    this.schema = expandSchema(schema);
    this.context = resolveContext(context);
    this.engine = new QueryEngineProxy(this.context, engine);
    this.queryBuilder = new QueryBuilder(this.schema, this.context);
  }

  private decode(graph: Graph) {
    return decode(graph, this.schema, this.context) as unknown as I[];
  }

  async count() {
    const q = this.queryBuilder.countQuery();
    // TODO: console.log(q);
    const bindings = await this.engine.queryBindings(q);
    return parseInt(bindings[0].get("count")!.value);
  }

  //exists(entity: Identity) {}

  async query(sparqlConstructQuery: string) {
    const graph = await this.engine.queryGraph(sparqlConstructQuery);
    return this.decode(graph);
  }

  async find(
    options: { where?: string | RDF.Quad[]; take?: number; skip?: number } = {},
  ) {
    const { where, take, skip } = {
      take: 1000,
      skip: 0,
      ...options,
    };
    const q = this.queryBuilder.getQuery(where, take, skip);
    // TODO: console.log(q);
    const graph = await this.engine.queryGraph(q);
    return this.decode(graph);
  }

  async findByIri(iri: Iri) {
    const results = await this.findByIris([iri]);
    return results.length > 0 ? results[0] : null;
  }

  async findByIris(iris: Iri[]) {
    const q = this.queryBuilder.getByIrisQuery(iris);
    // TODO: console.log(q);
    const graph = await this.engine.queryGraph(q);
    return this.decode(graph);
  }

  private updateQuery(query: string) {
    // TODO: console.log(query);
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
    // TODO: console.log(q);
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
