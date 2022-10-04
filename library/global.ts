import type { Context, IQueryEngine } from "./rdf.ts";
import { QueryEngine } from "./engine/mod.ts";

let defaultContext: Context | undefined = undefined;
let defaultEngine: IQueryEngine | undefined = undefined;

export const setDefaultContext = (context: Context) => {
  defaultContext = context;
};

export const resolveContext = (context?: Context) => {
  if (!context && !defaultContext) {
    throw new Error(
      "No context found. Please create a default context or pass one to createLens function",
    );
  }
  return context || defaultContext!;
};

export const setDefaultEngine = (engine: IQueryEngine) => {
  defaultEngine = engine;
};

export const resolveEngine = (engine?: IQueryEngine) => {
  if (!engine && !defaultEngine) {
    setDefaultEngine(new QueryEngine());
    // TODO: consider the consequences here, maybe log a warning?
    /*throw new Error(
      "No engine found. Please create a default engine or pass one to createLens function",
    );*/
  }
  return engine || defaultEngine!;
};
