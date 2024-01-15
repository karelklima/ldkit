import { createLens, type SchemaInterface } from "ldkit";

import { options } from "./options";
import {
  SearchSchema,
  PersonSchema,
  MovieSchema,
  MovieActorsSchema,
  MovieDirectorsSchema,
  MovieWritersSchema,
  MovieComposersSchema,
  ActorMoviesSchema,
  TypesSchema,
  DirectorMoviesSchema,
  WriterMoviesSchema,
  ComposerMoviesSchema,
} from "./schemas";

export const Types = createLens(TypesSchema, options);

export const Persons = createLens(PersonSchema, options);

export const ActorMovies = createLens(ActorMoviesSchema, options);
export const DirectorMovies = createLens(DirectorMoviesSchema, options);
export const WriterMovies = createLens(WriterMoviesSchema, options);
export const ComposerMovies = createLens(ComposerMoviesSchema, options);

export const Movies = createLens(MovieSchema, options);

export const MoviesActors = createLens(MovieActorsSchema, options);
export const MoviesDirectors = createLens(MovieDirectorsSchema, options);
export const MoviesWriters = createLens(MovieWritersSchema, options);
export const MoviesComposers = createLens(MovieComposersSchema, options);

export const Search = createLens(SearchSchema, options);
export type SearchInterface = SchemaInterface<typeof SearchSchema>;
