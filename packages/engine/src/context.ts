import type { IDataSource } from "@comunica/bus-rdf-resolve-quad-pattern";

export type DataSources = IDataSource | IDataSource[];

export type EngineContext = {
  sources: IDataSource[];
};

let defaultContext: EngineContext | undefined = undefined;

export const createContext = (sources: DataSources): EngineContext => {
  return {
    sources: Array.isArray(sources) ? sources : [sources],
  };
};

export const createDefaultContext = (sources: DataSources) => {
  defaultContext = createContext(sources);
};

export const resolveContext = (context?: EngineContext) => {
  if (!context && !defaultContext) {
    throw new Error(
      "No context found. Please create a default context or pass one to createResource function"
    );
  }
  return context || defaultContext!;
};
