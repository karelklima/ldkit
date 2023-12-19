import { SparqlValue } from "../sparql/mod.ts";

export type SearchFilters<T> = T | {
  $equals?: T;
  $not?: T;
  $contains?: T;
  $strStarts?: T;
  $strEnds?: T;
  $gt?: T;
  $gte?: T;
  $lt?: T;
  $lte?: T;
  $regex?: string;
  $langMatches?: string;
  $filter?: SparqlValue;
};

export type SearchSchema = {
  [key: string]: SearchFilters<unknown> | SearchSchema;
};
