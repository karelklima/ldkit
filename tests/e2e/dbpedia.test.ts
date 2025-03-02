import { assert } from "../test_deps.ts";
import { logQuery } from "../test_utils.ts";

import { createLens, createNamespace } from "ldkit";
import { rdfs, xsd } from "ldkit/namespaces";

const dbo = createNamespace(
  {
    iri: "http://dbpedia.org/ontology/",
    prefix: "dbo:",
    terms: ["Person", "abstract", "thumbnail", "birthDate", "birthName"],
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

const Actors = createLens(ActorSchema, {
  source: "https://dbpedia.org/sparql",
  language: "en",
  logQuery,
});

const favouriteActors = [
  "http://dbpedia.org/resource/Brad_Pitt",
  "http://dbpedia.org/resource/Karl_Urban",
  "http://dbpedia.org/resource/Margot_Robbie",
  "http://dbpedia.org/resource/Gal_Gadot",
];

Deno.test("E2E / DBpedia / Query single remote entity", async () => {
  const BradId = "http://dbpedia.org/resource/Brad_Pitt";
  const BradName = "Brad Pitt";
  const actor = await Actors.findByIri(favouriteActors[0]);
  assert(actor);
  assert(actor.$id === BradId);
  assert(actor.name === BradName);
});

Deno.test("E2E / DBpedia / Query multiple specific remote entities", async () => {
  const actors = await Actors.findByIris(favouriteActors);
  assert(actors);
  assert(actors.length === favouriteActors.length);
});

Deno.test("E2E / DBpedia / Query multiple random remote entities", async () => {
  const actors = await Actors.find({ take: 7 });
  assert(actors.length == 7);
});

Deno.test("E2E / DBpedia / Query count", async () => {
  const count = await Actors.count(100);
  assert(count > 0);
});
