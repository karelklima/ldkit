import { type Context, IQueryEngine, quadsToGraph, type RDF } from "../rdf.ts";
import { resolveContext, resolveEngine } from "../global.ts";
import { from, map, of, switchMap } from "../rxjs.ts";
import { type AsyncIterator } from "../asynciterator.ts";

export class QueryEngineProxy {
  private readonly context: Context;
  private readonly engine: IQueryEngine;

  constructor(context?: Context, engine?: IQueryEngine) {
    this.context = resolveContext(context);
    this.engine = resolveEngine(engine);
  }

  queryBoolean(query: string) {
    return from(this.engine.queryBoolean(query, this.context));
  }

  queryBindings(query: string) {
    return from(this.engine.queryBindings(query, this.context)).pipe(
      switchMap((stream) =>
        from((stream as unknown as AsyncIterator<RDF.Bindings>).toArray())
      ),
    );
  }

  queryGraph(query: string) {
    return from(this.engine.queryQuads(query, this.context)).pipe(
      switchMap((stream) =>
        from((stream as unknown as AsyncIterator<RDF.Quad>).toArray())
      ),
      map((quads) => {
        return quadsToGraph(quads);
      }),
    );
  }

  queryVoid(query: string) {
    return from(this.engine.queryVoid(query, this.context));
  }
}
