import { BehaviorSubject, map, share, switchMap, tap } from "../rxjs.ts";

import type { Context, Graph, IQueryEngine, Iri, RDF } from "../rdf.ts";
import { resolveContext } from "../global.ts";
import {
  expandSchema,
  type Schema,
  type SchemaInterface,
  type SchemaInterfaceIdentity,
  type SchemaPrototype,
} from "../schema/mod.ts";
import { decode } from "../decoder.ts";

import { QueryBuilder } from "./query_builder.ts";
import type { Entity } from "./types.ts";
import { QueryEngineProxy } from "../engine/query_engine_proxy.ts";

export const createResource = <T extends SchemaPrototype>(
  spec: T,
  context?: Context,
  engine?: IQueryEngine,
) => new Resource(spec, context, engine);

export class Resource<S extends SchemaPrototype, I = SchemaInterface<S>> {
  private readonly schema: Schema;
  private readonly context: Context;
  private readonly engine: QueryEngineProxy;
  private readonly queryBuilder: QueryBuilder;
  private readonly $trigger = new BehaviorSubject(null);

  constructor(schema: S, context?: Context, engine?: IQueryEngine) {
    this.schema = expandSchema(schema);
    this.context = resolveContext(context);
    this.engine = new QueryEngineProxy(this.context, engine);
    this.queryBuilder = new QueryBuilder(this.schema, this.context);
  }

  private decode(graph: Graph) {
    return decode(graph, this.schema, this.context) as unknown as I[];
  }

  count() {
    const q = this.queryBuilder.countQuery();
    console.log(q);
    return this.$trigger.pipe(
      switchMap(() => this.engine.queryBindings(q)),
      map((bindings) => {
        console.warn("BINDINGS", bindings);
        return parseInt(bindings[0].get("count")!.value);
      }),
    );
  }

  //exists(entity: Identity) {}

  query(sparqlConstructQuery: string) {
    console.log(sparqlConstructQuery);
    return this.engine.queryGraph(sparqlConstructQuery).pipe(
      map((graph) => {
        console.warn("GRAPH", graph);
        return this.decode(graph);
      }),
    );
  }

  find(where?: string | RDF.Quad[], limit?: number) {
    const q = this.queryBuilder.getQuery(where, limit);
    console.log(q);
    return this.$trigger.pipe(
      switchMap(() => this.engine.queryGraph(q)),
      map((graph) => {
        console.warn("GRAPH", graph);
        return this.decode(graph);
      }),
    );
  }

  findByIri(iri: Iri) {
    return this.findByIris([iri]).pipe(
      map((result) => (result.length > 0 ? result[0] : undefined)),
    );
  }

  findByIris(iris: Iri[]) {
    const q = this.queryBuilder.getByIrisQuery(iris);
    console.log(q);
    return this.$trigger.pipe(
      switchMap(() => this.engine.queryGraph(q)),
      map((graph) => {
        return this.decode(graph);
      }),
    );
  }

  private updateQuery(query: string) {
    console.log(query);

    const result = this.engine.queryVoid(query).pipe(
      tap(() => this.$trigger.next(null)),
      share(),
    );
    result.subscribe();
    return result;
  }

  insert(...entities: Entity<I>[]) {
    const q = this.queryBuilder.insertQuery(entities);

    return this.updateQuery(q);
  }

  insertData(...quads: RDF.Quad[]) {
    const q = this.queryBuilder.insertDataQuery(quads);

    return this.updateQuery(q);
  }

  update(...entities: Entity<I>[]) {
    const q = this.queryBuilder.updateQuery(entities);

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
