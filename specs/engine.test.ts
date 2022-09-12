import { assert, describe, it } from "./test_deps.ts";

import {
  type Context,
  createNamespace,
  createResource,
  type SchemaInterface,
} from "../mod.ts";
import { rdfs, xsd } from "../library/namespaces/mod.ts";
import { firstValueFrom } from "../library/rxjs.ts";

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
} as Context);

export type ActorInterface = SchemaInterface<typeof ActorSchema>;

export const Actors = createResource(ActorSchema, createLanguageContext("en"));

export const favouriteActors = [
  "http://dbpedia.org/resource/Brad_Pitt",
  "http://dbpedia.org/resource/Karl_Urban",
  "http://dbpedia.org/resource/Margot_Robbie",
  "http://dbpedia.org/resource/Gal_Gadot",
];

export const languages = ["en", "cs", "ru", "de"];

describe("Engine", () => {
  it("Query single remote entity", async () => {
    const BradId = "http://dbpedia.org/resource/Brad_Pitt";
    const BradName = "Brad Pitt";
    const actor = await firstValueFrom(Actors.findByIri(favouriteActors[0]));
    console.log(actor);
    assert(actor);
    assert(actor.$id === BradId);
    assert(actor.name === BradName);
  });

  it("Query count", async () => {
    const count = await firstValueFrom(Actors.count());
    console.log(count);
    assert(count > 0);
  });
});
