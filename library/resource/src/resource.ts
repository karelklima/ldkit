import { map, switchMap, tap, share } from "rxjs/operators";
import { BehaviorSubject } from "rxjs";

import type { Graph, Iri, Quad } from "@ldkit/rdf";
import { bindingsQuery, quadsQuery, updateQuery } from "@ldkit/engine";
import type { Context } from "@ldkit/context";
import { resolveContext } from "@ldkit/context";
import type {
  Schema,
  SchemaPrototype,
  SchemaInterface,
  SchemaInterfaceIdentity,
} from "@ldkit/schema";
import { expandSchema } from "@ldkit/schema";
import { decode } from "@ldkit/decoder";

import { QueryBuilder } from "./query-builder";
import type { Entity } from "./types";

export const createResource = <T extends SchemaPrototype>(
  spec: T,
  context?: Context
) => new Resource(spec, context);

export class Resource<S extends SchemaPrototype, I = SchemaInterface<S>> {
  private readonly schema: Schema;
  private readonly context: Context;
  private readonly queryBuilder: QueryBuilder;
  private readonly $trigger = new BehaviorSubject(null);

  constructor(schema: S, context?: Context) {
    this.schema = expandSchema(schema);
    this.context = resolveContext(context);
    this.queryBuilder = new QueryBuilder(this.schema, this.context);
  }

  private decode(graph: Graph) {
    return decode(graph, this.schema, this.context) as unknown as I[];
  }

  count() {
    const q = this.queryBuilder.countQuery();
    console.log(q);
    return this.$trigger.pipe(
      switchMap(() => bindingsQuery(q, this.context)),
      map((bindings) => {
        return parseInt(bindings[0].get("?count").value);
      })
    );
  }

  //exists(entity: Identity) {}

  query(sparqlConstructQuery: string) {
    console.log(sparqlConstructQuery);
    return quadsQuery(sparqlConstructQuery, this.context).pipe(
      map((graph) => {
        return this.decode(graph);
      })
    );
  }

  find(where?: string | Quad[], limit?: number) {
    const q = this.queryBuilder.getQuery(where, limit);
    console.log(q);
    return this.$trigger.pipe(
      switchMap(() => quadsQuery(q, this.context)),
      map((graph) => {
        return this.decode(graph);
      })
    );
  }

  findByIri(iri: Iri) {
    return this.findByIris([iri]).pipe(
      map((result) => (result.length > 0 ? result[0] : undefined))
    );
  }

  findByIris(iris: Iri[]) {
    const q = this.queryBuilder.getByIrisQuery(iris);
    console.log(q);
    return this.$trigger.pipe(
      switchMap(() => quadsQuery(q, this.context)),
      map((graph) => {
        return this.decode(graph);
      })
    );
  }

  private updateQuery(query: string) {
    console.log(query);

    const result = updateQuery(query, this.context).pipe(
      tap(() => this.$trigger.next(null)),
      share()
    );
    result.subscribe();
    return result;
  }

  insert(...entities: Entity<I>[]) {
    const q = this.queryBuilder.insertQuery(entities);

    return this.updateQuery(q);
  }

  insertData(...quads: Quad[]) {
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

  deleteData(...quads: Quad[]) {
    const q = this.queryBuilder.deleteDataQuery(quads);

    return this.updateQuery(q);
  }
}
