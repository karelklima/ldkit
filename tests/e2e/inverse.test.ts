import { assertEquals, Comunica } from "../test_deps.ts";

import { initStore, x } from "../test_utils.ts";

import { createLens } from "ldkit";

const engine = new Comunica();

Deno.test("E2E / Inverse / Read simple inverse property", async () => {
  const { setStore, context } = initStore();

  const EntitySchema = {
    isPropertyOf: {
      "@id": x.property,
      "@inverse": true,
    },
  } as const;

  const Entities = createLens(EntitySchema, context, engine);

  await setStore(`
    x:A x:property x:B .
  `);

  const entities = await Entities.find();

  assertEquals(entities.length, 1);
  assertEquals(entities[0], {
    $id: x.B,
    isPropertyOf: x.A,
  });
});

Deno.test("E2E / Inverse / Read complex inverse property", async () => {
  const { setStore, context } = initStore();

  const SubEntitySchema = {
    property: x.property,
  } as const;

  const EntitySchema = {
    isPropertyOf: {
      "@id": x.property,
      "@inverse": true,
      "@context": SubEntitySchema,
    },
  } as const;

  const Entities = createLens(EntitySchema, context, engine);

  await setStore(`
    x:A x:property x:B .
  `);

  const entities = await Entities.find();

  assertEquals(entities.length, 1);
  assertEquals(entities[0], {
    $id: x.B,
    isPropertyOf: {
      $id: x.A,
      property: x.B,
    },
  });
});

Deno.test("E2E / Inverse / Read missing optional inverse property", async () => {
  const { setStore, context } = initStore();

  const EntitySchema = {
    "@type": x.Entity,
    isPropertyOf: {
      "@id": x.property,
      "@inverse": true,
      "@optional": true,
    },
  } as const;

  const Entities = createLens(EntitySchema, context, engine);

  await setStore(`
    x:A a x:Entity .
  `);

  const entities = await Entities.find();

  assertEquals(entities.length, 1);
  assertEquals(entities[0], {
    $id: x.A,
    isPropertyOf: null,
  });
});
