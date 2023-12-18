export type CreateSearchInterface<T> = T | { $equals?: T };

export type SearchSchema = {
  [key: string]: CreateSearchInterface<unknown> | SearchSchema;
};
