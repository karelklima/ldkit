import { map, switchMap, tap, share } from "rxjs/operators";
import { BehaviorSubject } from "rxjs";

import type { Graph } from "@ldkit/rdf";
import { bindingsQuery, quadsQuery, updateQuery } from "@ldkit/engine";
import type { EngineContext } from "@ldkit/engine";
import type { Schema, SchemaPrototype, SchemaInterface } from "@ldkit/schema";
import { expandSchema } from "@ldkit/schema";

import type { Iri } from "./iri";
import {
  deleteQuery,
  findIrisQuery,
  findQuery,
  getObjectByIrisQuery,
  insertQuery,
} from "./query-builder";
import { createProxy } from "./proxy";
import { entityToRdf } from "./utils";

export class Resource<S extends SchemaPrototype, I = SchemaInterface<S>> {
  private readonly schema: Schema;
  private readonly context?: EngineContext;
  private readonly $trigger = new BehaviorSubject(null);

  constructor(schema: S, context?: EngineContext) {
    this.schema = expandSchema(schema);
    this.context = context;
  }

  private createProxy(graph: Graph, pointer: Iri) {
    return createProxy(this.schema, graph, pointer) as unknown as I;
  }

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

  insert(iri: Iri, entity: Partial<I>) {
    console.log(`Inserting ${iri} data`);

    const rdf = entityToRdf(iri, entity, this.schema);

    console.log(rdf);

    const q = insertQuery(rdf);

    console.log(q);

    const result = updateQuery(q, this.context).pipe(
      tap(() => this.$trigger.next(null)),
      share()
    );
    result.subscribe();
    return result;
  }

  delete(iri: Iri) {
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
