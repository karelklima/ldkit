import { quadsToGraph, type RDF } from "../rdf.ts";
import { type AsyncIterator } from "../asynciterator.ts";

import type { IQueryEngine, QueryContext } from "./types.ts";

export class QueryEngineProxy {
  private readonly engine: IQueryEngine;
  private readonly context: QueryContext;

  constructor(engine: IQueryEngine, context: QueryContext) {
    this.engine = engine;
    this.context = context;
  }

  queryBoolean(query: string) {
    return this.engine.queryBoolean(query, this.context);
  }

  async queryBindings(query: string) {
    const bindingsStream = await this.engine.queryBindings(
      query,
      this.context,
    ) as unknown as AsyncIterator<RDF.Bindings>;
    return bindingsStream.toArray();
  }

  async queryGraph(query: string) {
    const quadStream = await this.engine.queryQuads(
      query,
      this.context,
    );
    return quadsToGraph(quadStream);
  }

  queryVoid(query: string) {
    return this.engine.queryVoid(query, this.context);
  }
}
