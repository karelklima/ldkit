import { type Schema } from "ldkit";
import { rdfs, rdf, dbo, ldkit } from "ldkit/namespaces";

export const TypesSchema = {
  types: {
    "@id": rdf.type,
    "@type": ldkit.IRI,
    "@array": true,
  },
} satisfies Schema;

export const LabelSchema = {
  name: rdfs.label,
} satisfies Schema;

export const SearchSchema = {
  ...LabelSchema,
  ...TypesSchema,
} satisfies Schema;

export const PersonSchema = {
  name: rdfs.label,
  abstract: dbo.abstract,
  birthDate: {
    "@id": dbo.birthDate,
    "@type": "xsd:date",
    "@optional": true,
  },
  deathDate: {
    "@id": dbo.deathDate,
    "@type": "xsd:date",
    "@optional": true,
  },
  thumbnail: {
    "@id": dbo.thumbnail,
    "@optional": true,
  },
} satisfies Schema;

export const ActorMoviesSchema = {
  isStarringIn: {
    "@id": dbo.starring,
    "@schema": LabelSchema,
    "@array": true,
    "@optional": true,
    "@inverse": true,
  },
} satisfies Schema;

export const DirectorMoviesSchema = {
  isDirecting: {
    "@id": dbo.director,
    "@schema": LabelSchema,
    "@array": true,
    "@optional": true,
    "@inverse": true,
  },
} satisfies Schema;

export const WriterMoviesSchema = {
  isWriting: {
    "@id": dbo.writer,
    "@schema": LabelSchema,
    "@array": true,
    "@optional": true,
    "@inverse": true,
  },
} satisfies Schema;

export const ComposerMoviesSchema = {
  isComposing: {
    "@id": dbo.musicComposer,
    "@schema": LabelSchema,
    "@array": true,
    "@optional": true,
    "@inverse": true,
  },
} satisfies Schema;

export const MovieSchema = {
  name: rdfs.label,
  abstract: dbo.abstract,
  director: {
    "@id": dbo.director,
    "@schema": LabelSchema,
    "@optional": true,
  },
  writer: {
    "@id": dbo.writer,
    "@schema": LabelSchema,
    "@optional": true,
  },
  musicComposer: {
    "@id": dbo.musicComposer,
    "@schema": LabelSchema,
    "@optional": true,
  },
  thumbnail: {
    "@id": dbo.thumbnail,
    "@optional": true,
  },
} satisfies Schema;

export const MovieActorsSchema = {
  starring: {
    "@id": dbo.starring,
    "@schema": LabelSchema,
    "@array": true,
    "@optional": true,
  },
} satisfies Schema;

export const MovieDirectorsSchema = {
  directors: {
    "@id": dbo.director,
    "@schema": LabelSchema,
    "@array": true,
    "@optional": true,
  },
} satisfies Schema;

export const MovieWritersSchema = {
  writers: {
    "@id": dbo.writer,
    "@schema": LabelSchema,
    "@array": true,
    "@optional": true,
  },
} satisfies Schema;

export const MovieComposersSchema = {
  composers: {
    "@id": dbo.musicComposer,
    "@schema": LabelSchema,
    "@array": true,
    "@optional": true,
  },
} satisfies Schema;
