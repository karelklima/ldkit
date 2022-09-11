import { assertEquals, describe, it } from "./test_deps.ts";

import { ArrayMappingStream } from "../library/engine/array_mapping_stream.ts";

describe("Array Mapping Stream", () => {
  it("Should process empty array", () => {
    const s = new ArrayMappingStream([], (x) => x);
    assertEquals(s.read(), null);
    assertEquals(s.read(), null);
    assertEquals(s.read(), null);
  });

  it("Should process simple array", () => {
    const s = new ArrayMappingStream([1, 2, 3], (x) => x);
    assertEquals(s.read(), 1);
    assertEquals(s.read(), 2);
    assertEquals(s.read(), 3);
    assertEquals(s.read(), null);
  });

  it("Should map array items", () => {
    const s = new ArrayMappingStream([1, 2, 3], (x) => 2 * x);
    assertEquals(s.read(), 2);
    assertEquals(s.read(), 4);
    assertEquals(s.read(), 6);
    assertEquals(s.read(), null);
  });
});
