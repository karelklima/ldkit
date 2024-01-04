import { assert } from "./test_deps.ts";

import {
  createLens,
  createNamespace,
  type Options,
  type SchemaInterface,
} from "ldkit";
import { rdfs, xsd } from "ldkit/namespaces";

export const dbo = createNamespace(
  {
    iri: "http://dbpedia.org/ontology/",
    prefix: "dbo:",
    terms: ["Person", "abstract", "thumbnail", "birthDate", "birthName"],
  } as const,
);

export const dbp = createNamespace(
  {
    iri: "http://dbpedia.org/property/",
    prefix: "dbp:",
    terms: ["name"],
  } as const,
);

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

export const Actors = createLens(ActorSchema, createLanguageContext("en"));

export const favouriteActors = [
  "http://dbpedia.org/resource/Brad_Pitt",
  "http://dbpedia.org/resource/Karl_Urban",
  "http://dbpedia.org/resource/Margot_Robbie",
  "http://dbpedia.org/resource/Gal_Gadot",
];

export const languages = ["en", "cs", "ru", "de"];

Deno.test("E2E / Query single remote entity", async () => {
  const BradId = "http://dbpedia.org/resource/Brad_Pitt";
  const BradName = "Brad Pitt";
  const actor = await Actors.findByIri(favouriteActors[0]);
  assert(actor);
  assert(actor.$id === BradId);
  assert(actor.name === BradName);
});

Deno.test("E2E / Query count", async () => {
  const count = await Actors.count();
  assert(count > 0);
});
