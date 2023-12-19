import {
  type Context,
  IQueryEngine,
  N3,
  quadsToGraph,
  type RDF,
} from "../rdf.ts";
import { resolveContext, resolveEngine } from "../global.ts";
import { type AsyncIterator } from "../asynciterator.ts";

export class QueryEngineProxy {
  private readonly context: Context;
  private readonly engine: IQueryEngine;

  constructor(context?: Context, engine?: IQueryEngine) {
    this.context = resolveContext(context);
    this.engine = resolveEngine(engine);
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
    ) as unknown as AsyncIterator<RDF.Quad>;
    const quads = await (quadStream.toArray());
    const store = new N3.Store(quads);
    return quadsToGraph(store);
  }

  queryVoid(query: string) {
    return this.engine.queryVoid(query, this.context);
  }
}
