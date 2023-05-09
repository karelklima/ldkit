import { assertEquals } from "./test_deps.ts";
import { type Tree, TreeIterator } from "../library/asynciterator.ts";

async function assertIterator(input: Tree<unknown>, output: unknown[]) {
  const i = new TreeIterator(input);
  const result = await i.toArray();
  assertEquals(result, output);
}

Deno.test("TreeIterator / Empty object", async () => {
  const input = {};
  const output: unknown[] = [];
  await assertIterator(input, output);
});

Deno.test("TreeIterator / Simple array", async () => {
  const input = ["hello", "world"];
  const output = [["hello"], ["world"]];
  await assertIterator(input, output);
});

Deno.test("TreeIterator / One level tree", async () => {
  const input = {
    key: ["hello", "world"],
    other: ["hello", "world", "!"],
  };
  const output = [
    ["key", "hello"],
    ["key", "world"],
    ["other", "hello"],
    ["other", "world"],
    ["other", "!"],
  ];
  await assertIterator(input, output);
});

Deno.test("TreeIterator / Two level tree", async () => {
  const input = {
    one: {
      two: ["hello", "world"],
      other: ["!"],
    },
  };
  const output = [
    ["one", "two", "hello"],
    ["one", "two", "world"],
    ["one", "other", "!"],
  ];
  await assertIterator(input, output);
});

Deno.test("TreeIterator / Asymetric tree", async () => {
  const input = {
    a: {
      aa: ["aaa", "aab"],
      ab: {
        aba: ["!", "!"],
      },
    },
    b: ["bb"],
  };
  const output = [
    ["a", "aa", "aaa"],
    ["a", "aa", "aab"],
    ["a", "ab", "aba", "!"],
    ["a", "ab", "aba", "!"],
    ["b", "bb"],
  ];
  await assertIterator(input, output);
});
