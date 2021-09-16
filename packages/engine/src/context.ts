import type { IDataSource } from "@comunica/bus-rdf-resolve-quad-pattern";

export type DataSources = IDataSource | IDataSource[];

export type FetchType = (
  resource: RequestInfo,
  init?: RequestInit
) => Promise<Response>;

export type EngineContext = {
  sources: IDataSource[];
  fetch?: FetchType;
};

let defaultContext: EngineContext | undefined = undefined;

export const createContext = (
  sources: DataSources,
  fetch?: FetchType
): EngineContext => {
  return {
    sources: Array.isArray(sources) ? sources : [sources],
    fetch,
  };
};

export const createDefaultContext = (
  sources: DataSources,
  fetch?: FetchType
) => {
  defaultContext = createContext(sources, fetch);
};

export const resolveContext = (context?: EngineContext) => {
  if (!context && !defaultContext) {
    throw new Error(
      "No context found. Please create a default context or pass one to createResource function"
    );
  }
  return context || defaultContext!;
};
