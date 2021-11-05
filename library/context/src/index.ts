import type {
  IDataSource,
  DataSources,
} from "@comunica/bus-rdf-resolve-quad-pattern";

export type { IDataSource, DataSources };

export type FetchType = (
  resource: RequestInfo,
  init?: RequestInit
) => Promise<Response>;

type ComunicaContext = {
  sources: DataSources;
  initialBindings: any;
  queryFormat: any;
  baseIri: string;
  log: any;
  datetime: any;
  queryTimestamp: any;
  httpProxyHandler: any;
  lenient: any;
  httpIncludeCredentials: boolean;
  httpAuth: string;
  fetch: FetchType;
  extensionFunctions: any;
  extensionFunctionsCreator: any;
};

type LibraryContext = {
  graph: string;
  language: string;
};

export type Context = Partial<LibraryContext> & Partial<ComunicaContext>;

let defaultContext: Context | undefined = undefined;

export const createContext = (context: Context): Context => {
  return context;
};

export const createDefaultContext = (context: Context = {}) => {
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
