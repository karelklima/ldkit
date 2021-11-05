import {
  createResource,
  createNamespace,
  createDefaultContext,
  createContext,
} from "@ldkit/core";
import type { SchemaInterface } from "@ldkit/core";
import { xsd } from "@ldkit/namespaces";

export const dbo = createNamespace({
  iri: "http://dbpedia.org/ontology/",
  prefix: "dbo:",
  terms: ["Person", "abstract", "thumbnail", "birthDate", "birthName"],
} as const);

export const dbp = createNamespace({
  iri: "http://dbpedia.org/property/",
  prefix: "dbp:",
  terms: ["name"],
} as const);

export const rdfs = createNamespace({
  iri: "http://www.w3.org/2000/01/rdf-schema#",
  prefix: "rdfs:",
  terms: ["label"],
} as const);

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

export const createLanguageContext = (language: string) =>
  createContext({
    sources: ["https://dbpedia.org/sparql"],
    language,
  });

export type ActorInterface = SchemaInterface<typeof ActorSchema>;

export const createLocalizedActorResource = (language: string) =>
  createResource(ActorSchema, createLanguageContext(language));

export const favouriteActors = [
  "http://dbpedia.org/resource/Brad_Pitt",
  "http://dbpedia.org/resource/Karl_Urban",
  "http://dbpedia.org/resource/Margot_Robbie",
  "http://dbpedia.org/resource/Gal_Gadot",
];

export const languages = ["en", "cs", "ru", "de"];
