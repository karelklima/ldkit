import { map, switchMap, tap, share } from "rxjs/operators";
import { BehaviorSubject } from "rxjs";

import type { Graph } from "@ldkit/rdf";
import { bindingsQuery, quadsQuery, updateQuery } from "@ldkit/engine";
import type { EngineContext } from "@ldkit/engine";
import type {
  Schema,
  SchemaPrototype,
  SchemaInterface,
  SchemaInterfaceType,
  SchemaInterfaceIdentity,
  //SchemaInterfaceIdentity,
} from "@ldkit/schema";
import { expandSchema } from "@ldkit/schema";

import type { Iri } from "./iri";
import {
  deleteQuery,
  findIrisQuery,
  findQuery,
  getObjectByIrisQuery,
  insertQuery,
  QueryBuilder,
} from "./query-builder";
import { createProxy } from "./proxy";
import { entityToRdf } from "./utils";

//type Identity = SchemaInterfaceIdentity | Iri;

export class Resource<S extends SchemaPrototype, I = SchemaInterface<S>> {
  private readonly schema: Schema;
  private readonly context?: EngineContext;
  private readonly queryBuilder: QueryBuilder;
  private readonly $trigger = new BehaviorSubject(null);

  constructor(schema: S, context?: EngineContext) {
    this.schema = expandSchema(schema);
    this.context = context;
    this.queryBuilder = new QueryBuilder(this.schema);
  }

  private createProxy(graph: Graph, pointer: Iri) {
    return createProxy(this.schema, graph, pointer) as unknown as I;
  }

  //exists(entity: Identity) {}

  find() {
    const q = findIrisQuery(this.schema);
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
    console.log("whoa");
    return this.findByIris([iri]).pipe(map((result) => result[0]));
  }

  findByIris(iris: Iri[]) {
    const q = getObjectByIrisQuery(iris, this.schema);
    return quadsQuery(q, this.context).pipe(
      map((graph) => {
        return iris.reduce((result, iri) => {
          result.push(this.createProxy(graph, iri));
          return result;
        }, new Array<I>());
      })
    );
  }

  findAll() {
    const q = findIrisQuery(this.schema);
    const q2 = findQuery(this.schema);
    return bindingsQuery(q, this.context).pipe(
      map((bindings) => {
        return bindings.reduce((acc, binding) => {
          acc.push(binding.get("?iri").value);
          return acc;
        }, new Array<Iri>());
      }),
      switchMap((iris) =>
        quadsQuery(q2).pipe(
          map((graph) => {
            return iris.map((iri) => this.createProxy(graph, iri)) as I[];
          })
        )
      )
    );
  }

  insert(
    entity: Omit<I, "@type" | "@id"> &
      Partial<SchemaInterfaceType> &
      SchemaInterfaceIdentity
  ) {
    console.log(`Inserting ${entity["@id"]} data`);

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
    console.log(`Updating ${entity["@id"]} data`);

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
    const iri = identity["@id"];
    console.log(`Deleting ${iri} data`);

    const q = deleteQuery(iri);

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
  context?: EngineContext
) => new Resource(spec, context);
