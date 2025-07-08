import { assert, assertEquals, equal } from "./test_deps.ts";

import { initStore, ttl, x } from "./test_utils.ts";

import { createLens } from "ldkit";
import { rdf, xsd } from "ldkit/namespaces";
import { DataFactory } from "ldkit/rdf";

const assertContainsEqual = (haystack: unknown[], needle: unknown) => {
  let found = false;
  for (const item of haystack) {
    if (equal(item, needle)) {
      found = true;
      break;
    }
  }
  assert(found);
};

const Instant = {
  "@type": x.Instant,
  date: {
    "@id": x.inXSDDate,
    "@type": xsd.date,
  },
} as const;

const Director = {
  "@type": x.Director,
  name: x.name,
} as const;

const Movie = {
  "@type": x.Movie,
  name: x.name,
  director: {
    "@id": x.director,
    "@schema": Director,
  },
  released: {
    "@id": x.released,
    "@schema": Instant,
    "@optional": true,
  },
} as const;

const defaultStoreContent = ttl(`
  x:StanleyKubrick
    a x:Director ;
    x:name "Stanley Kubrick" .
  x:QuentinTarantino
    a x:Director ;
    x:name "Quentin Tarantino" .
  x:FullMetalJacket
    a x:Movie;
    x:name "Full Metal Jacket" ;
    x:director x:StanleyKubrick .
  x:Shining
    a x:Movie;
    x:name "Shining" ;
    x:director x:StanleyKubrick .
  x:PulpFiction
    a x:Movie;
    x:name "Pulp Fiction" ;
    x:director x:QuentinTarantino .
`);

const createDirector = ($id: string, name: string) => ({
  $id: x[$id],
  name,
});

const Tarantino = createDirector("QuentinTarantino", "Quentin Tarantino");
const Kubrick = createDirector("StanleyKubrick", "Stanley Kubrick");

const _ = new DataFactory();

export const init = () => {
  const { store, options, assertStore, empty } = initStore();
  store.addQuads(defaultStoreContent);
  const directors = createLens(Director, options);
  const movies = createLens(Movie, options);
  return { directors, movies, assertStore, empty };
};

Deno.test("Lens / Common / Get many resources", async () => {
  const { directors } = init();
  const result = await directors.find();

  assertEquals(result.length, 2);
  assertContainsEqual(result, Tarantino);
  assertContainsEqual(result, Kubrick);
});

Deno.test("Lens / Common / Get resource by IRI", async () => {
  const { directors } = init();
  const result = await directors.findByIri(Tarantino.$id);

  assertEquals(result, Tarantino);
});

Deno.test("Lens / Common / Get multiple resources by IRI", async () => {
  const { directors } = init();
  const result = await directors.findByIris([Tarantino.$id, Kubrick.$id]);

  assertContainsEqual(result, Tarantino);
  assertContainsEqual(result, Kubrick);
});

Deno.test("Lens / Common / Get resource by string condition", async () => {
  const { directors } = init();
  const condition = `?iri <${x.name}> "Quentin Tarantino" .`;
  const result = await directors.find({ where: condition });

  assertEquals(result.length, 1);
  assertEquals(result[0], Tarantino);
});

Deno.test("Lens / Common / Get resource by quad condition", async () => {
  const { directors } = init();
  const condition = _.quad(
    _.variable("iri"),
    _.namedNode(x.name),
    _.literal("Quentin Tarantino"),
  );
  const result = await directors.find({ where: [condition] });

  assertEquals(result.length, 1);
  assertEquals(result[0], Tarantino);
});

Deno.test("Lens / Common / Get one resource", async () => {
  const { directors } = init();
  const result = await directors.findOne();

  assertEquals(result, Kubrick);
});

Deno.test("Lens / Common / Count resources", async () => {
  const { directors } = init();
  const count = await directors.count();
  assertEquals(count, 2);
});

Deno.test("Lens / Common / Count resources max", async () => {
  const { directors } = init();
  const count = await directors.count({ max: 1 });
  assertEquals(count, 1);
});

Deno.test("Lens / Common / Count resources where", async () => {
  const { directors } = init();
  const count = await directors.count({
    where: { name: "Quentin Tarantino" },
  });
  assertEquals(count, 1);
});

Deno.test("Lens / Common / Count resources where nested", async () => {
  const { movies } = init();
  const count = await movies.count({
    where: { director: { name: "Stanley Kubrick" } },
  });
  assertEquals(count, 2);
});

Deno.test("Lens / Common / Insert multiple resources", async () => {
  const { directors, empty, assertStore } = init();
  await empty();
  await directors.insert(Kubrick, Tarantino);

  assertStore(`
      x:StanleyKubrick
        a x:Director ;
        x:name "Stanley Kubrick" .
      x:QuentinTarantino
        a x:Director ;
        x:name "Quentin Tarantino" .
    `);
});

Deno.test("Lens / Common / Insert complex resource", async () => {
  const { movies } = init();
  await movies.insert({
    $id: x.IngloriousBasterds,
    name: "Inglorious Basterds",
    director: { $id: x.QuentinTarantino },
    released: { date: new Date("2008-01-01") },
  });
  const result = await movies.findByIri(x.IngloriousBasterds);

  assertEquals(result?.name, "Inglorious Basterds");
  assertEquals(result?.director, Tarantino);
  assertEquals(result?.released?.date, new Date("2008-01-01"));
});

Deno.test("Lens / Common / Update multiple resources", async () => {
  const { directors } = init();
  await directors.update(
    {
      $id: Kubrick.$id,
      name: "Kubrick Stanley",
    },
    {
      $id: Tarantino.$id,
      name: "Tarantino Quentin",
    },
  );
  const result = await directors.find();

  assertContainsEqual(result, { ...Tarantino, name: "Tarantino Quentin" });
  assertContainsEqual(result, { ...Kubrick, name: "Kubrick Stanley" });
});

Deno.test("Lens / Common / Delete multiple resources", async () => {
  const { directors } = init();
  await directors.delete(Tarantino, Kubrick);
  const dirs = await directors.find();
  assertEquals(dirs.length, 0);
});

Deno.test("Lens / Common / Insert data", async () => {
  const { directors } = init();
  await directors.insert({
    $id: x.ChristopherNolan,
  });
  await directors.insertData(
    _.quad(
      _.namedNode(x.ChristopherNolan),
      _.namedNode(x.name),
      _.literal("Christopher Nolan"),
    ),
  );
  const result = await directors.findByIri(x.ChristopherNolan);
  assertEquals(result, {
    $id: x.ChristopherNolan,
    name: "Christopher Nolan",
  });
});

Deno.test("Lens / Common / Delete data", async () => {
  const { directors } = init();
  await directors.insert({
    $id: x.ChristopherNolan,
    name: "Christopher Nolan",
  });
  await directors.deleteData(
    _.quad(
      _.namedNode(x.ChristopherNolan),
      _.namedNode(rdf.type),
      _.namedNode(x.CustomType),
    ),
  );
  const result = await directors.findByIri(x.ChristopherNolan);
  assertEquals(result, {
    $id: x.ChristopherNolan,
    name: "Christopher Nolan",
  });
});
