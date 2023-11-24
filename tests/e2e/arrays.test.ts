import { Comunica } from "../test_deps.ts";

import { initStore, ttl, x } from "../test_utils.ts";

import { createLens } from "ldkit";

const engine = new Comunica();

const Director = {
  name: x.name,
  movies: {
    "@id": x.movie,
    "@array": true,
  },
} as const;

const defaultStoreContent = ttl(`
  x:QuentinTarantino
    x:name "Quentin Tarantino" ;
    x:movie "Pulp Fiction", "Reservoir Dogs" .
  `);

const init = () => {
  const { store, context, assertStore, empty } = initStore();
  store.addQuads(defaultStoreContent);
  const Directors = createLens(Director, context, engine);
  return { Directors, assertStore, empty };
};

Deno.test("E2E / Array / Set shortcut", async () => {
  const { Directors, assertStore } = init();

  await Directors.update({
    $id: x.QuentinTarantino,
    movies: ["Kill Bill", "Inglorious Basterds"],
  });

  assertStore(`
    x:QuentinTarantino
      x:name "Quentin Tarantino" ;
      x:movie "Kill Bill", "Inglorious Basterds" .
  `);
});

Deno.test("E2E / Array / Set full", async () => {
  const { Directors, assertStore } = init();

  await Directors.update({
    $id: x.QuentinTarantino,
    movies: {
      $set: ["Kill Bill", "Inglorious Basterds"],
    },
  });

  assertStore(`
    x:QuentinTarantino
      x:name "Quentin Tarantino" ;
      x:movie "Kill Bill", "Inglorious Basterds" .
  `);
});

Deno.test("E2E / Array / Set empty array", async () => {
  const { Directors, assertStore } = init();

  await Directors.update({
    $id: x.QuentinTarantino,
    movies: [],
  });

  assertStore(`
    x:QuentinTarantino
      x:name "Quentin Tarantino" .
  `);
});

Deno.test("E2E / Array / Add", async () => {
  const { Directors, assertStore } = init();

  await Directors.update({
    $id: x.QuentinTarantino,
    movies: {
      $add: ["Kill Bill", "Inglorious Basterds"],
    },
  });

  assertStore(`
    x:QuentinTarantino
      x:name "Quentin Tarantino" ;
      x:movie "Pulp Fiction", "Reservoir Dogs", "Kill Bill", "Inglorious Basterds" .
  `);
});

Deno.test("E2E / Array / Remove", async () => {
  const { Directors, assertStore } = init();

  await Directors.update({
    $id: x.QuentinTarantino,
    movies: {
      $remove: ["Pulp Fiction"],
    },
  });

  assertStore(`
    x:QuentinTarantino
      x:name "Quentin Tarantino" ;
      x:movie "Reservoir Dogs" .
  `);
});

Deno.test("E2E / Array / Update multiple entities", async () => {
  const { Directors, assertStore } = init();

  await Directors.insert({
    $id: x.StanleyKubrick,
    name: "Stanley Kubrick",
    movies: ["2001: A Space Odyssey", "The Shining"],
  });

  await Directors.update({
    $id: x.QuentinTarantino,
    movies: {
      $remove: ["Reservoir Dogs"],
    },
  }, {
    $id: x.StanleyKubrick,
    movies: {
      $add: ["A Clockwork Orange"],
    },
  });

  assertStore(`
    x:QuentinTarantino
      x:name "Quentin Tarantino" ;
      x:movie "Pulp Fiction" .
    x:StanleyKubrick
      x:name "Stanley Kubrick" ;
      x:movie "2001: A Space Odyssey", "The Shining", "A Clockwork Orange" .
  `);
});
