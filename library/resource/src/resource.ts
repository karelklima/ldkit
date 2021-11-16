import { map, switchMap, tap, share } from "rxjs/operators";
import { BehaviorSubject } from "rxjs";

import type { Graph, Iri } from "@ldkit/rdf";
import { bindingsQuery, quadsQuery, updateQuery } from "@ldkit/engine";
import type { Context } from "@ldkit/context";
import { resolveContext } from "@ldkit/context";
import type {
  Schema,
  SchemaPrototype,
  SchemaInterface,
  SchemaInterfaceType,
  SchemaInterfaceIdentity,
} from "@ldkit/schema";
import { expandSchema } from "@ldkit/schema";
import { decode } from "@ldkit/decoder";

import { QueryBuilder } from "./query-builder";

export class Resource<S extends SchemaPrototype, I = SchemaInterface<S>> {
  private readonly schema: Schema;
  private readonly context: Context;
  private readonly queryBuilder: QueryBuilder;
  private readonly $trigger = new BehaviorSubject(null);

  constructor(schema: S, context?: Context) {
    this.schema = expandSchema(schema);
    this.context = resolveContext(context);
    this.queryBuilder = new QueryBuilder(this.schema);
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

  find() {
    const q = this.queryBuilder.getIrisQuery();
    console.log(q);
    return this.$trigger.pipe(
      switchMap(() => bindingsQuery(q, this.context)),
      map((bindings) => {
        return bindings.reduce((acc, binding) => {
          acc.push(binding.get("?iri").value);
          return acc;
        }, new Array<Iri>());
      }),
      switchMap((iris) => this.findByIris(iris))
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
    return quadsQuery(q, this.context).pipe(
      map((graph) => {
        return this.decode(graph);
      })
    );
  }

  insert(
    entity: Omit<I, "$type" | "$id"> &
      Partial<SchemaInterfaceType> &
      SchemaInterfaceIdentity
  ) {
    console.log(`Inserting ${entity.$id} data`);

    const q = this.queryBuilder.insertQuery(entity);

    console.log(q);

    const result = updateQuery(q, this.context).pipe(
      tap(() => this.$trigger.next(null)),
      share()
    );
    result.subscribe();
    return result;
  }

  update(entity: Partial<Omit<I, "@id">> & SchemaInterfaceIdentity) {
    console.log(`Updating ${entity.$id} data`);

    const q = this.queryBuilder.updateQuery(entity);

    console.log(q);

    const result = updateQuery(q, this.context).pipe(
      tap(() => this.$trigger.next(null)),
      share()
    );
    result.subscribe();
    return result;
  }

  delete(identity: SchemaInterfaceIdentity) {
    const iri = identity.$id;
    console.log(`Deleting ${iri} data`);

    const q = this.queryBuilder.deleteQuery(iri);

    console.log(q);

    const result = updateQuery(q, this.context).pipe(
      tap(() => this.$trigger.next(null)),
      share()
    );
    result.subscribe();
    return result;
  }
}

export const createResource = <T extends SchemaPrototype>(
  spec: T,
  context?: Context
) => new Resource(spec, context);
