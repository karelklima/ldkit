import { assertEquals } from "./test_deps.ts";

import { initStore, x } from "./test_utils.ts";

import { createLens } from "ldkit";
import { rdf } from "ldkit/namespaces";
import { DataFactory } from "ldkit/rdf";

const df = new DataFactory();

const Item = {
  "@type": x.Item,
  label: x.label,
} as const;

const graphA = x.GraphA;
const graphB = x.GraphB;

const itemQuads = (graph: string, id: string, label: string) => [
  df.quad(
    df.namedNode(id),
    df.namedNode(rdf.type),
    df.namedNode(x.Item),
    df.namedNode(graph),
  ),
  df.quad(
    df.namedNode(id),
    df.namedNode(x.label),
    df.literal(label),
    df.namedNode(graph),
  ),
];

const init = () => {
  const { store, options } = initStore();
  store.addQuads([
    ...itemQuads(graphA, x.ItemA, "in graph A"),
    ...itemQuads(graphB, x.ItemB, "in graph B"),
  ]);
  return { store, options };
};

Deno.test("Lens / Graph scoping / find() only sees the configured graph", async () => {
  const { options } = init();

  const inA = createLens(Item, { ...options, defaultGraph: graphA });
  const resultsA = await inA.find();
  assertEquals(resultsA.map((r) => r.label), ["in graph A"]);

  const inB = createLens(Item, { ...options, defaultGraph: graphB });
  const resultsB = await inB.find();
  assertEquals(resultsB.map((r) => r.label), ["in graph B"]);
});

Deno.test("Lens / Graph scoping / find() without a graph option sees neither named graph", async () => {
  const { options } = init();

  const unscoped = createLens(Item, options);
  const results = await unscoped.find();

  assertEquals(results, []);
});

Deno.test("Lens / Graph scoping / find(where) is scoped to the configured graph", async () => {
  const { options } = init();

  const inA = createLens(Item, { ...options, defaultGraph: graphA });
  const resultsA = await inA.find({ where: { label: "in graph B" } });
  assertEquals(resultsA, []);

  const inB = createLens(Item, { ...options, defaultGraph: graphB });
  const resultsB = await inB.find({ where: { label: "in graph B" } });
  assertEquals(resultsB.map((r) => r.label), ["in graph B"]);
});

Deno.test("Lens / Graph scoping / findByIri is scoped to the configured graph", async () => {
  const { options } = init();

  const inA = createLens(Item, { ...options, defaultGraph: graphA });
  assertEquals(await inA.findByIri(x.ItemB), null);
  assertEquals((await inA.findByIri(x.ItemA))?.label, "in graph A");

  const inB = createLens(Item, { ...options, defaultGraph: graphB });
  assertEquals((await inB.findByIri(x.ItemB))?.label, "in graph B");
});

Deno.test("Lens / Graph scoping / count() is scoped to the configured graph", async () => {
  const { options } = init();

  const inA = createLens(Item, { ...options, defaultGraph: graphA });
  assertEquals(await inA.count(), 1);

  const unscoped = createLens(Item, options);
  assertEquals(await unscoped.count(), 0);
});

Deno.test("Lens / Graph scoping / update() only matches entities in the configured graph", async () => {
  const { options } = init();

  const inA = createLens(Item, { ...options, defaultGraph: graphA });
  await inA.update({
    $id: x.ItemB,
    label: "update via graph A should not apply",
  });

  const inB = createLens(Item, { ...options, defaultGraph: graphB });
  const untouched = await inB.findByIri(x.ItemB);
  assertEquals(untouched?.label, "in graph B");

  await inB.update({ $id: x.ItemB, label: "renamed via graph B" });
  const renamed = await inB.findByIri(x.ItemB);
  assertEquals(renamed?.label, "renamed via graph B");
});

Deno.test("Lens / Graph scoping / delete() only matches entities in the configured graph", async () => {
  const { options } = init();

  const inA = createLens(Item, { ...options, defaultGraph: graphA });
  await inA.delete(x.ItemB);

  const inB = createLens(Item, { ...options, defaultGraph: graphB });
  const stillThere = await inB.findByIri(x.ItemB);
  assertEquals(stillThere?.label, "in graph B");

  await inB.delete(x.ItemB);
  assertEquals(await inB.findByIri(x.ItemB), null);
});

Deno.test("Lens / Graph scoping / insert() writes into the configured graph", async () => {
  const { options } = init();

  const inA = createLens(Item, { ...options, defaultGraph: graphA });
  await inA.insert({ $id: x.ItemC, label: "in graph A" });
  assertEquals((await inA.findByIri(x.ItemC))?.label, "in graph A");

  const unscoped = createLens(Item, options);
  assertEquals(await unscoped.findByIri(x.ItemC), null);

  const inB = createLens(Item, { ...options, defaultGraph: graphB });
  assertEquals(await inB.findByIri(x.ItemC), null);
});

Deno.test("Lens / Graph scoping / insertData()/deleteData() target the configured graph", async () => {
  const { options } = init();

  const inA = createLens(Item, { ...options, defaultGraph: graphA });
  const quads = [
    df.quad(
      df.namedNode(x.ItemC),
      df.namedNode(rdf.type),
      df.namedNode(x.Item),
    ),
    df.quad(
      df.namedNode(x.ItemC),
      df.namedNode(x.label),
      df.literal("added via insertData"),
    ),
  ];
  await inA.insertData(...quads);

  const unscoped = createLens(Item, options);
  assertEquals(await unscoped.findByIri(x.ItemC), null);
  assertEquals((await inA.findByIri(x.ItemC))?.label, "added via insertData");

  await inA.deleteData(...quads);
  assertEquals(await inA.findByIri(x.ItemC), null);
});

Deno.test("Lens / Graph scoping / insertData() only fills in a graph for quads that don't already have one", async () => {
  const { store, options } = init();

  const inA = createLens(Item, { ...options, defaultGraph: graphA });
  const defaultGraphQuad = df.quad(
    df.namedNode(x.ItemC),
    df.namedNode(x.label),
    df.literal("promoted to graph A"),
  );
  const explicitGraphBQuad = df.quad(
    df.namedNode(x.ItemD),
    df.namedNode(x.label),
    df.literal("stays in graph B"),
    df.namedNode(graphB),
  );
  await inA.insertData(defaultGraphQuad, explicitGraphBQuad);

  assertEquals(
    store.getQuads(
      df.namedNode(x.ItemC),
      df.namedNode(x.label),
      null,
      df.namedNode(graphA),
    ).length,
    1,
  );
  assertEquals(
    store.getQuads(
      df.namedNode(x.ItemD),
      df.namedNode(x.label),
      null,
      df.namedNode(graphB),
    ).length,
    1,
  );
});
