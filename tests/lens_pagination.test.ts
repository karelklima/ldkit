import { assertEquals, Comunica } from "./test_deps.ts";

import { initStore, x } from "./test_utils.ts";

import { createLens } from "../library/lens/mod.ts";
import { xsd } from "../library/namespaces/mod.ts";
import { DataFactory } from "../library/rdf.ts";

import { type SchemaInterface } from "../library/schema/mod.ts";

const engine = new Comunica();
const _ = new DataFactory();

const Item = {
  index: x.index,
} as const;

type ItemType = SchemaInterface<typeof Item>;

const range = (start: number, end: number) =>
  [...Array(1 + end - start).keys()].map((i) => i + start);

const defaultStoreContent = range(0, 99).map((i) =>
  _.quad(
    _.namedNode(x.Item + i),
    _.namedNode(x.index),
    _.literal(i.toString(), xsd.integer),
  )
);

const assertContainsRange = (items: ItemType[], start: number, end: number) => {
  const actual = items.map((item) => item.index);
  const expected = range(start, end).map((it) => it.toString());
  assertEquals(actual, expected);
};

const init = () => {
  const { store, context, assertStore, empty } = initStore();
  store.addQuads(defaultStoreContent);
  const items = createLens(Item, context, engine);
  return { items, assertStore, empty };
};

Deno.test("Lens / Pagination / Take", async () => {
  const { items } = init();

  const result1 = await items.find({ take: 1 });
  assertContainsRange(result1, 0, 0);

  const result10 = await items.find({ take: 10 });
  assertContainsRange(result10, 0, 9);

  const result100 = await items.find({ take: 100 });
  assertContainsRange(result100, 0, 99);

  const result1000 = await items.find({ take: 1000 });
  assertContainsRange(result1000, 0, 99); // extra items should be ignored
});

Deno.test("Lens / Pagination / Skip", async () => {
  const { items } = init();

  const result0 = await items.find({ take: 10, skip: 0 });
  assertContainsRange(result0, 0, 9);

  const result10 = await items.find({ take: 10, skip: 10 });
  assertContainsRange(result10, 10, 19);

  const result90 = await items.find({ take: 10, skip: 90 });
  assertContainsRange(result90, 90, 99);

  const result100 = await items.find({ take: 10, skip: 100 });
  assertEquals(result100, []); // extra items should be ignored
});
