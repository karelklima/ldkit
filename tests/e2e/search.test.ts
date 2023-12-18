import { assertEquals, Comunica } from "../test_deps.ts";

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
  x:StanleyKubrick
    x:name "Stanley Kubrick" ;
    x:movie "The Shining", "A Clockwork Orange" .
  x:StevenSpielberg
    x:name "Steven Spielberg" ;
    x:movie "Jurassic Park", "Jaws", "Schindler's List" .
  `);

const init = () => {
  const { store, context, assertStore, empty } = initStore();
  store.addQuads(defaultStoreContent);
  const Directors = createLens(Director, context, engine);
  return { Directors, assertStore, empty };
};

Deno.test("E2E / Search / Search by exact value", async () => {
  const { Directors } = init();

  const results = await Directors.find({
    where: { name: "Quentin Tarantino" },
  });

  assertEquals(results.length, 1);
  assertEquals(results[0].name, "Quentin Tarantino");
});
