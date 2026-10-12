import { assert, assertEquals, Comunica } from "../test_deps.ts";

import { initStore, x } from "../test_utils.ts";

import { createLens } from "ldkit";

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
  const { options, assertStore } = initStore();
  const Entities = createLens(EntitySchema, options);
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

Deno.test("E2E / Optional / Set to empty optional array property", async () => {
  const { Entities, assertStore } = init();

  await Entities.insert({
    $id: x.Entity,
    requiredString: "required",
    optionalArray: [],
  });

  assertStore(`
    x:Entity
      a x:Entity ;
      x:requiredString "required" .
  `);

  await Entities.update({
    $id: x.Entity,
    optionalArray: { $set: ["setArray"] },
  });

  assertStore(`
    x:Entity
      a x:Entity ;
      x:requiredString "required" ;
      x:optionalArray "setArray" .
  `);
});

Deno.test("E2E / Optional / Add to empty optional array property", async () => {
  const { Entities, assertStore } = init();

  await Entities.insert({
    $id: x.Entity,
    requiredString: "required",
    optionalArray: [],
  });

  assertStore(`
    x:Entity
      a x:Entity ;
      x:requiredString "required" .
  `);

  await Entities.update({
    $id: x.Entity,
    optionalArray: { $add: ["addArray"] },
  });

  assertStore(`
    x:Entity
      a x:Entity ;
      x:requiredString "required" ;
      x:optionalArray "addArray" .
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

const NestedSchema = {
  "@type": x.Entity,
  requiredString: x.requiredString,
  optionalArray: {
    "@id": x.optionalArray,
    "@optional": true,
    "@array": true,
  },
  otherOptionalArray: {
    "@id": x.otherOptionalArray,
    "@optional": true,
    "@array": true,
  },
  optionalChild: {
    "@id": x.optionalChild,
    "@optional": true,
    "@schema": {
      requiredString: x.requiredString,
      optionalArray: {
        "@id": x.optionalArray,
        "@optional": true,
        "@array": true,
      },
    },
  },
} as const;

const nestedStoreContent = `
  x:Full
    a x:Entity ;
    x:requiredString "full" ;
    x:optionalArray "a", "b", "c" ;
    x:otherOptionalArray "d", "e", "f" ;
    x:optionalChild x:Child .
  x:Child
    x:requiredString "child" ;
    x:optionalArray "g", "h" .
  x:Partial
    a x:Entity ;
    x:requiredString "partial" ;
    x:otherOptionalArray "i" ;
    x:optionalChild x:ChildWithoutArray .
  x:ChildWithoutArray
    x:requiredString "child without array" .
  x:Empty
    a x:Entity ;
    x:requiredString "empty" .
`;

Deno.test("E2E / Optional / Should return entities with any combination of optional properties", async () => {
  const { options, setStore } = initStore();
  await setStore(nestedStoreContent);

  const entities = await createLens(NestedSchema, options).find();
  const byId = Object.fromEntries(
    entities.map((entity) => [entity.$id, entity]),
  );

  assertEquals(entities.length, 3);
  assertEquals(byId[x.Full].optionalArray.sort(), ["a", "b", "c"]);
  assertEquals(byId[x.Full].otherOptionalArray.sort(), ["d", "e", "f"]);
  assertEquals(byId[x.Full].optionalChild?.requiredString, "child");
  assertEquals(byId[x.Full].optionalChild?.optionalArray.sort(), ["g", "h"]);
  assertEquals(byId[x.Partial].optionalArray, []);
  assertEquals(byId[x.Partial].otherOptionalArray, ["i"]);
  assertEquals(byId[x.Partial].optionalChild?.optionalArray, []);
  assertEquals(byId[x.Empty].optionalArray, []);
  assertEquals(byId[x.Empty].otherOptionalArray, []);
  assertEquals(byId[x.Empty].optionalChild, null);
});

Deno.test("E2E / Optional / Should not multiply the values of optional properties", async () => {
  const { options, context, setStore } = initStore();
  await setStore(nestedStoreContent);

  let query = "";
  await createLens(NestedSchema, {
    ...options,
    logQuery: (loggedQuery) => query = loggedQuery,
  }).findByIri(x.Full);

  const quadStream = await new Comunica().queryQuads(query, context);
  const quads = await quadStream.toArray();
  const distinctQuads = new Set(
    quads.map((quad) =>
      `${quad.subject.value} ${quad.predicate.value} ${quad.object.value}`
    ),
  );

  // One solution for the entity by itself, and one for each value of each
  // optional property: 1 + 3 + 3 + (1 + 2) = 10, where consecutive OPTIONALs
  // would yield 3 * 3 * 2 = 18. Every solution repeats the two quads of the
  // entity itself, and each solution for the child those of the child.
  assertEquals(distinctQuads.size, 12);
  assertEquals(quads.length, 10 * 2 + 3 + 3 + 3 * 2 + 2);
});
