import { assertEquals } from "../test_deps.ts";

import { initStore, ttl, x } from "../test_utils.ts";

import { createLens, type Schema } from "ldkit";
import { ldkit, rdf, xsd } from "ldkit/namespaces";

const Director = {
  types: {
    "@id": rdf.type,
    "@type": ldkit.IRI,
    "@array": true,
  },
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
  x:A
    a x:TypeA, x:TypeAOrB .
  x:B
    a x:TypeB, x:TypeAOrB .
  x:C
    a x:TypeC .
  `);

const init = () => {
  const { store, options, assertStore, empty } = initStore();
  store.addQuads(defaultStoreContent);
  const Directors = createLens(Director, options);
  return { Directors, assertStore, empty, store, options };
};

Deno.test("E2E / RDF types / Query one type", async () => {
  const { options } = init();

  const SchemaPrototype = {
    "@type": x.TypeB,
  } satisfies Schema;

  const results = await createLens(SchemaPrototype, options).find();

  assertEquals(results.length, 1);
  assertEquals(results[0], {
    $id: x.B,
  });
});

Deno.test("E2E / RDF types / Query multiple types", async () => {
  const { options } = init();

  const SchemaPrototype = {
    "@type": [x.TypeA, x.TypeAOrB],
  } satisfies Schema;

  const results = await createLens(SchemaPrototype, options).find();

  assertEquals(results.length, 1);
  assertEquals(results[0], {
    $id: x.A,
  });
});

Deno.test("E2E / RDF types / Query types using search", async () => {
  const { options } = init();

  const SchemaPrototype = {
    types: {
      "@id": rdf.type,
      "@type": ldkit.IRI,
      "@array": true,
    },
  } satisfies Schema;

  const results = await createLens(SchemaPrototype, options).find({
    where: {
      types: {
        $in: [x.TypeB, x.TypeC],
      },
    },
  });

  assertEquals(results.length, 2);
  assertEquals(results[0], {
    $id: x.B,
    types: [x.TypeB],
  });
  assertEquals(results[1], {
    $id: x.C,
    types: [x.TypeC],
  });
});
