import { assertEquals, Comunica } from "../test_deps.ts";

import { initStore, ttl, x } from "../test_utils.ts";

import { createLens } from "ldkit";
import { xsd } from "ldkit/namespaces";

const engine = new Comunica();

const Director = {
  name: x.name,
  birthDate: {
    "@id": x.birthDate,
    "@type": xsd.date,
  },
  movies: {
    "@id": x.movie,
    "@array": true,
  },
} as const;

const defaultStoreContent = ttl(`
  x:QuentinTarantino
    x:name "Quentin Tarantino" ;
    x:birthDate "1963-03-27"^^xsd:date ;
    x:movie "Pulp Fiction", "Reservoir Dogs" .
  x:StanleyKubrick
    x:name "Stanley Kubrick" ;
    x:birthDate "1928-07-26"^^xsd:date ;
    x:movie "The Shining", "A Clockwork Orange" .
  x:StevenSpielberg
    x:name "Steven Spielberg" ;
    x:birthDate "1946-12-18"^^xsd:date ;
    x:movie "Jurassic Park", "Jaws", "Schindler's List" .
  `);

const init = () => {
  const { store, context, assertStore, empty } = initStore();
  store.addQuads(defaultStoreContent);
  const Directors = createLens(Director, context, engine);
  return { Directors, assertStore, empty, store };
};

Deno.test("E2E / Search / $equals", async () => {
  const { Directors } = init();

  const results = await Directors.find({
    where: { name: "Quentin Tarantino" },
  });

  const resultsFull = await Directors.find({
    where: {
      name: {
        $equals: "Quentin Tarantino",
      },
    },
  });

  assertEquals(results.length, 1);
  assertEquals(results[0].name, "Quentin Tarantino");
  assertEquals(resultsFull.length, 1);
  assertEquals(results[0], resultsFull[0]);
});

Deno.test("E2E / Search / $not", async () => {
  const { Directors } = init();

  const results = await Directors.find({
    where: {
      name: {
        $not: "Quentin Tarantino",
      },
    },
  });

  assertEquals(results.length, 2);
  assertEquals(results[0].name, "Stanley Kubrick");
  assertEquals(results[1].name, "Steven Spielberg");
});

Deno.test("E2E / Search / $contains", async () => {
  const { Directors } = init();

  const results = await Directors.find({
    where: {
      name: {
        $contains: "Quentin",
      },
    },
  });

  assertEquals(results.length, 1);
  assertEquals(results[0].name, "Quentin Tarantino");
});

Deno.test("E2E / Search / $strStarts", async () => {
  const { Directors } = init();

  const results = await Directors.find({
    where: {
      name: {
        $strStarts: "Quentin",
      },
    },
  });

  assertEquals(results.length, 1);
  assertEquals(results[0].name, "Quentin Tarantino");
});

Deno.test("E2E / Search / $strEnds", async () => {
  const { Directors } = init();

  const results = await Directors.find({
    where: {
      name: {
        $strEnds: "Tarantino",
      },
    },
  });

  assertEquals(results.length, 1);
  assertEquals(results[0].name, "Quentin Tarantino");
});

Deno.test("E2E / Search / $gt $lt", async () => {
  const { Directors } = init();

  const results = await Directors.find({
    where: {
      birthDate: {
        $gt: new Date("1928-07-26"),
        $lt: new Date("1963-03-27"),
      },
    },
  });

  assertEquals(results.length, 1);
  assertEquals(results[0].name, "Steven Spielberg");
});

Deno.test("E2E / Search / $gte $lte", async () => {
  const { Directors } = init();

  const results = await Directors.find({
    where: {
      birthDate: {
        $gte: new Date("1928-07-26"),
        $lte: new Date("1963-03-27"),
      },
    },
  });

  assertEquals(results.length, 3);
});

Deno.test("E2E / Search / $regex", async () => {
  const { Directors } = init();

  const results = await Directors.find({
    where: {
      name: {
        $regex: "^Q(.*)o$",
      },
    },
  });

  assertEquals(results.length, 1);
  assertEquals(results[0].name, "Quentin Tarantino");
});

Deno.test("E2E / Search / $langMatches", async () => {
  const { Directors, store, empty } = init();

  await empty();

  const localizedStoreContent = ttl(`
  x:QuentinTarantino
    x:name "Quentin Tarantino"@en, "クエンティン・タランティーノ"@jp, "昆汀·塔伦蒂诺"@zh ;
    x:birthDate "1963-03-27"^^xsd:date ;
    x:movie "Pulp Fiction", "Reservoir Dogs" .
  x:StanleyKubrick
    x:name "Stanley Kubrick"@en, "スタンリー・キューブリック"@jp, "斯坦利·库布里克"@zh ;
    x:birthDate "1928-07-26"^^xsd:date ;
    x:movie "The Shining", "A Clockwork Orange" .
  x:StevenSpielberg
    x:name "Steven Spielberg"@en, "スティーヴン・スピルバーグ"@jp, "史蒂文·斯皮尔伯格"@zh ;
    x:birthDate "1946-12-18"^^xsd:date ;
    x:movie "Jurassic Park", "Jaws", "Schindler's List" .
  `);

  store.addQuads(localizedStoreContent);

  const results = await Directors.find({
    where: {
      name: {
        $langMatches: "jp",
      },
    },
  });

  assertEquals(results.length, 3);
  assertEquals(results[0].name, "クエンティン・タランティーノ");
  assertEquals(results[1].name, "スタンリー・キューブリック");
  assertEquals(results[2].name, "スティーヴン・スピルバーグ");
});

Deno.test("E2E / Search / $filter", async () => {
  const { Directors } = init();

  const results = await Directors.find({
    where: {
      name: {
        $filter: "strlen(?value) = 17",
      },
    },
  });

  assertEquals(results.length, 1);
  assertEquals(results[0].name, "Quentin Tarantino");
});
