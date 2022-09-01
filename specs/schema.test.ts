import { describe, it, assertEquals, assertTypeSafe } from "./test_deps.ts";
import { x, Equals } from "./test_utils.ts";

import { Schema, expandSchema } from "$/schema/mod.ts";
import type { SchemaInterface } from "$/schema/mod.ts";
import { xsd } from "$/namespaces/mod.ts";

type ThingType = {
  $id: string;
  $type: string[];
  required: string;
  optional: string | undefined;
  array: string[];
  multilang: Record<string, string>;
  multilangArray: Record<string, string[]>;
  number: number;
  boolean: boolean;
  date: Date;
  nested: {
    $id: string;
    $type: string[];
    nestedValue: string;
  };
};

const Thing = {
  "@type": x.X,
  required: x.required,
  optional: {
    "@id": x.optional,
    "@optional": true,
  },
  array: {
    "@id": x.array,
    "@array": true,
  },
  multilang: {
    "@id": x.multilang,
    "@multilang": true,
  },
  multilangArray: {
    "@id": x.multilangArray,
    "@multilang": true,
    "@array": true,
  },
  number: {
    "@id": x.number,
    "@type": xsd.integer,
  },
  boolean: {
    "@id": x.boolean,
    "@type": xsd.boolean,
  },
  date: {
    "@id": x.date,
    "@type": xsd.date,
  },
  nested: {
    "@id": x.nested,
    "@context": {
      "@type": x.Nested,
      nestedValue: x.nestedValue,
    },
  },
} as const;

const ThingSchema: Schema = {
  "@type": [x.X],
  required: {
    "@id": x.required,
    "@type": xsd.string,
  },
  optional: {
    "@id": x.optional,
    "@type": xsd.string,
    "@optional": true,
  },
  array: {
    "@id": x.array,
    "@type": xsd.string,
    "@array": true,
  },
  multilang: {
    "@id": x.multilang,
    "@type": xsd.string,
    "@multilang": true,
  },
  multilangArray: {
    "@id": x.multilangArray,
    "@type": xsd.string,
    "@multilang": true,
    "@array": true,
  },
  number: {
    "@id": x.number,
    "@type": xsd.integer,
  },
  boolean: {
    "@id": x.boolean,
    "@type": xsd.boolean,
  },
  date: {
    "@id": x.date,
    "@type": xsd.date,
  },
  nested: {
    "@id": x.nested,
    "@context": {
      "@type": [x.Nested],
      nestedValue: {
        "@id": x.nestedValue,
        "@type": xsd.string,
      },
    },
  },
};

describe("Schema", () => {
  it("accepts schema prototype as schema interface creates schema interface from schema prototype", () => {
    const expandedSchema = expandSchema(Thing);

    type I = SchemaInterface<typeof Thing>;

    assertTypeSafe<Equals<SchemaInterface<typeof Thing>, ThingType>>();

    assertEquals(expandedSchema, ThingSchema);
  });
});
