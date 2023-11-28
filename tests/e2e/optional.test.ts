import { assert, Comunica } from "../test_deps.ts";

import { initStore, x } from "../test_utils.ts";

import { createLens } from "ldkit";

const engine = new Comunica();

const EntitySchema = {
  "@type": x.Entity,
  requiredString: {
    "@id": x.requiredString,
  },
  optionalString: {
    "@id": x.optionalString,
    "@optional": true,
  },
  optionalArray: {
    "@id": x.optionalArray,
    "@optional": true,
    "@array": true,
  },
} as const;

const init = () => {
  const { context, assertStore } = initStore();
  const Entities = createLens(EntitySchema, context, engine);
  return { Entities, assertStore };
};

Deno.test("E2E / Optional / Insert without optional properties", async () => {
  const { Entities, assertStore } = init();

  await Entities.insert({
    $id: x.Entity,
    requiredString: "required",
  });

  assertStore(`
    x:Entity
      a x:Entity ;
      x:requiredString "required" .
  `);
});

Deno.test("E2E / Optional / Insert with optional properties", async () => {
  const { Entities, assertStore } = init();

  await Entities.insert({
    $id: x.Entity,
    requiredString: "required",
    optionalString: "test",
    optionalArray: ["testArray", "otherArray"],
  });

  assertStore(`
    x:Entity
      a x:Entity ;
      x:requiredString "required" ;
      x:optionalString "test" ;
      x:optionalArray "testArray", "otherArray" .
  `);
});

Deno.test("E2E / Optional / Unset optional existing property", async () => {
  const { Entities, assertStore } = init();

  await Entities.insert({
    $id: x.Entity,
    requiredString: "required",
    optionalString: "test",
  });

  assertStore(`
    x:Entity
      a x:Entity ;
      x:requiredString "required" ;
      x:optionalString "test" .
  `);

  await Entities.update({
    $id: x.Entity,
    requiredString: "different",
    optionalString: null,
  });

  assertStore(`
    x:Entity
      a x:Entity ;
      x:requiredString "different" .
  `);
});

Deno.test("E2E / Optional / Unset optional existing array property", async () => {
  const { Entities, assertStore } = init();

  await Entities.insert({
    $id: x.Entity,
    requiredString: "required",
    optionalArray: ["test"],
  });

  assertStore(`
    x:Entity
      a x:Entity ;
      x:requiredString "required" ;
      x:optionalArray "test" .
  `);

  await Entities.update({
    $id: x.Entity,
    requiredString: "different",
    optionalArray: [],
  });

  assertStore(`
    x:Entity
      a x:Entity ;
      x:requiredString "different" .
  `);
});

Deno.test("E2E / Optional / Unset optional non-existing property", async () => {
  const { Entities, assertStore } = init();

  await Entities.insert({
    $id: x.Entity,
    requiredString: "required",
  });

  assertStore(`
    x:Entity
      a x:Entity ;
      x:requiredString "required" .
  `);

  await Entities.update({
    $id: x.Entity,
    requiredString: "different",
    optionalString: null,
  });

  assertStore(`
    x:Entity
      a x:Entity ;
      x:requiredString "different" .
  `);
});

Deno.test("E2E / Optional / Should return null for optional property without value", async () => {
  const { Entities, assertStore } = init();

  await Entities.insert({
    $id: x.Entity,
    requiredString: "required",
  });

  assertStore(`
    x:Entity
      a x:Entity ;
      x:requiredString "required" .
  `);

  const entity = await Entities.findByIri(x.Entity);

  assert(entity !== null);
  assert(entity.optionalString === null);
});

Deno.test("E2E / Optional / Should return empty array for optional array property without value", async () => {
  const { Entities, assertStore } = init();

  await Entities.insert({
    $id: x.Entity,
    requiredString: "required",
  });

  assertStore(`
    x:Entity
      a x:Entity ;
      x:requiredString "required" .
  `);

  const entity = await Entities.findByIri(x.Entity);

  assert(entity !== null);
  assert(Array.isArray(entity.optionalArray));
  assert(entity.optionalArray.length === 0);
});
