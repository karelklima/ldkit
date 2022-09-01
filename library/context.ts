import type {
  IDataSource,
  DataSources,
  QueryStringContext,
} from "https://esm.sh/@comunica/types";

export type { IDataSource, DataSources };

export type FetchType = (
  resource: RequestInfo,
  init?: RequestInit
) => Promise<Response>;

export type LibraryContext = Partial<{
  graph: string;
  language: string;
}>;

export type Context = LibraryContext & QueryStringContext;

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
      "No context found. Please create a default context or pass one to createResource function"
    );
  }
  return context || defaultContext!;
};
