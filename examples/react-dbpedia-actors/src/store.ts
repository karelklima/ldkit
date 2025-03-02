import { type Options, createLens, type SchemaInterface } from "ldkit";
import { dbo, rdfs, xsd } from "ldkit/namespaces";

const ActorSchema = {
  "@type": dbo.Person,
  name: rdfs.label,
  abstract: dbo.abstract,
  thumbnail: dbo.thumbnail,
  birthDate: {
    "@id": dbo.birthDate,
    "@type": xsd.date,
  },
  birthName: dbo.birthName,
} as const;

export const createLanguageContext = (language: string) => ({
  sources: ["https://dbpedia.org/sparql"],
  language,
} as Options);

export type ActorInterface = SchemaInterface<typeof ActorSchema>;

export const createLocalizedActorResource = (language: string) =>
  createLens(ActorSchema, createLanguageContext(language));

export const favouriteActors = [
  "http://dbpedia.org/resource/Brad_Pitt",
  "http://dbpedia.org/resource/Karl_Urban",
  "http://dbpedia.org/resource/Margot_Robbie",
  "http://dbpedia.org/resource/Gal_Gadot",
];

export const languages = ["en", "cs", "ru", "de"];
