import { assert, assertEquals } from "../test_deps.ts";

import { initStore, ttl, x } from "../test_utils.ts";

import { createLens } from "ldkit";

const defaultStoreContent = ttl(`
  x:QuentinTarantino
    x:name
      "Quentin Tarantino",
      "Quentin Tarantino"@en,
      "Quentin Tarantino ALT"@en,
      "クエンティン・タランティーノ"@jp,
      "昆汀·塔伦蒂诺"@zh .
`);

const init = () => {
  const { store, options, assertStore } = initStore();
  store.addQuads(defaultStoreContent);
  return { assertStore, options };
};

Deno.test("E2E / Multilang / Read multilang strings", async () => {
  const { options } = init();

  const DirectorSchema = {
    name: {
      "@id": x.name,
      "@multilang": true,
    },
  } as const;

  const Directors = createLens(DirectorSchema, options);

  const result = await Directors.findByIri(x.QuentinTarantino);

  assert(result !== null);
  assertEquals(result.name[""], "Quentin Tarantino");
  assertEquals(result.name.en, "Quentin Tarantino");
  assertEquals(result.name.jp, "クエンティン・タランティーノ");
  assertEquals(result.name.zh, "昆汀·塔伦蒂诺");
});

Deno.test("E2E / Multilang / Write multilang strings", async () => {
  const { options } = init();

  const DirectorSchema = {
    name: {
      "@id": x.name,
      "@multilang": true,
    },
  } as const;

  const Directors = createLens(DirectorSchema, options);

  await Directors.update({
    $id: x.QuentinTarantino,
    name: {
      "": "Not Quentin Tarantino",
      jp: "Not クエンティン・タランティーノ",
    },
  });

  const result = await Directors.findByIri(x.QuentinTarantino);

  assert(result !== null);
  assertEquals(result.name[""], "Not Quentin Tarantino");
  assertEquals(result.name.en, undefined);
  assertEquals(result.name.jp, "Not クエンティン・タランティーノ");
  assertEquals(result.name.zh, undefined);
});

Deno.test("E2E / Multilang / Read multilang array strings", async () => {
  const { options } = init();

  const DirectorSchema = {
    name: {
      "@id": x.name,
      "@multilang": true,
      "@array": true,
    },
  } as const;

  const Directors = createLens(DirectorSchema, options);

  const result = await Directors.findByIri(x.QuentinTarantino);

  assert(result !== null);
  assertEquals(result.name[""], ["Quentin Tarantino"]);
  assertEquals(result.name.en, ["Quentin Tarantino", "Quentin Tarantino ALT"]);
  assertEquals(result.name.jp, ["クエンティン・タランティーノ"]);
  assertEquals(result.name.zh, ["昆汀·塔伦蒂诺"]);
});
