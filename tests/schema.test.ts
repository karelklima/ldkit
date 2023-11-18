import { assertEquals, assertThrows, assertTypeSafe } from "./test_deps.ts";
import { Equals, x } from "./test_utils.ts";

import {
  expandSchema,
  Property,
  type Schema,
  type SchemaInterface,
  type SchemaPrototype,
} from "../library/schema/mod.ts";
import { xsd } from "../library/namespaces/mod.ts";
import rdf from "../library/namespaces/rdf.ts";

type ThingType = {
  $id: string;
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

Deno.test("Schema / accepts schema prototype as schema interface creates schema interface from schema prototype", () => {
  const expandedSchema = expandSchema(Thing);

  type I = SchemaInterface<typeof Thing>;

  assertTypeSafe<Equals<SchemaInterface<typeof Thing>, ThingType>>();

  assertEquals(expandedSchema, ThingSchema);
});

Deno.test("Schema / should have at least one property or @type restriction", () => {
  assertThrows(() => {
    expandSchema(undefined as unknown as SchemaPrototype);
  });
  assertThrows(() => {
    expandSchema({} as unknown as SchemaPrototype);
  });
});

Deno.test("Schema / should expand @type shortcut definition", () => {
  const schema = {
    "type": "@type",
  };
  const expandedSchema = expandSchema(schema);
  assertEquals((expandedSchema["type"] as Property)["@id"], rdf.type);
});

Deno.test("Schema / should expand @type property definition", () => {
  const schema = {
    "type": { "@id": "@type" },
  };
  const expandedSchema = expandSchema(schema);
  assertEquals((expandedSchema["type"] as Property)["@id"], rdf.type);
});
