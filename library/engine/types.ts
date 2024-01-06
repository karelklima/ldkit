import type {
  IDataSource,
  IQueryContextCommon,
} from "npm:@comunica/types@2.6.8";

import { RDF } from "../rdf.ts";

export type QueryContext =
  & RDF.QueryStringContext
  & RDF.QuerySourceContext<IDataSource>
  & IQueryContextCommon;

export type IQueryEngine = RDF.StringSparqlQueryable<
  RDF.SparqlResultSupport,
  QueryContext
>;
