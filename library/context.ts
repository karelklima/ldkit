import type { QueryStringContext } from "https://esm.sh/@comunica/types@2.4.0";

export type Context = Partial<{
  [key: string]: any;
  source: string;
  fetch: typeof fetch;
  graph: string;
  language: string;
}>;

type MergeTypes<A, B> = Omit<A, keyof B> & B;

export type ComunicaContext = MergeTypes<Context, QueryStringContext>;

let defaultContext: Context | undefined = undefined;

export const createContext = (context: Context): Context => {
  return context;
};

export const createDefaultContext = (context: Context) => {
  defaultContext = createContext(context);
};

export const resolveContext = (context?: Context) => {
  if (!context && !defaultContext) {
    throw new Error(
      "No context found. Please create a default context or pass one to createResource function",
    );
  }
  return context || defaultContext!;
};
