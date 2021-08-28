import { map, switchMap } from "rxjs/operators";

import type { Graph } from "@ldkit/rdf";
import { bindingsQuery, quadsQuery } from "@ldkit/engine";
import type { EngineContext } from "@ldkit/engine";
import type { Iri } from "../schema/iri";
import type { Schema, SchemaPrototype } from "../schema/schema";
import type { SchemaInterface } from "../schema/interface";
import { expandSchema } from "../schema/utils";
import {
  findIrisQuery,
  findQuery,
  getObjectByIrisQuery,
} from "./query-builder";
import { createProxy } from "./proxy";

class Access<S extends SchemaPrototype, I = SchemaInterface<S>> {
  private readonly schema: Schema;
  private readonly context?: EngineContext;

  constructor(schema: S, context?: EngineContext) {
    this.schema = expandSchema(schema);
    this.context = context;
  }

  private createProxy(graph: Graph, pointer: Iri) {
    return createProxy(this.schema, graph, pointer) as unknown as I;
  }

  find() {
    const q = findIrisQuery(this.schema);
    return bindingsQuery(q, this.context).pipe(
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
    return this.findByIris([iri]).pipe(map((result) => result[iri]));
  }

  findByIris(iris: Iri[]) {
    const q = getObjectByIrisQuery(iris, this.schema);
    return quadsQuery(q, this.context).pipe(
      map((graph) => {
        return iris.reduce((result, iri) => {
          result[iri] = this.createProxy(graph, iri);
          return result;
        }, {} as Record<Iri, I>);
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
}

export const createAccess = <T extends SchemaPrototype>(
  spec: T,
  context?: EngineContext
) => new Access(spec, context);
