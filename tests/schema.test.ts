import {
  assertEquals,
  assertThrows,
  assertTypeSafe,
  type Equals,
} from "./test_deps.ts";
import { x } from "./test_utils.ts";

import {
  expandSchema,
  Property,
  type Schema,
  type SchemaInterface,
  type SchemaPrototype,
  type SchemaUpdateInterface,
} from "../library/schema/mod.ts";
import { rdf, xsd } from "../namespaces.ts";

type ArrayUpdate<T> = {
  $set?: T[];
  $add?: T[];
  $remove?: T[];
} | T[];

Deno.test("Schema / Full schema", () => {
  type ThingType = {
    $id: string;
    required: string;
    optional: string | null;
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

  type ThingUpdateType = {
    $id: string;
    required?: string;
    optional?: string | null;
    array?: ArrayUpdate<string>;
    multilang?: Record<string, string>;
    multilangArray?: Record<string, ArrayUpdate<string>>;
    number?: number;
    boolean?: boolean;
    date?: Date;
    nested?: {
      $id: string;
      nestedValue?: string;
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
  const expandedSchema = expandSchema(Thing);

  type I = SchemaInterface<typeof Thing>;
  type U = SchemaUpdateInterface<typeof Thing>;

  assertTypeSafe<Equals<I, ThingType>>();
  assertTypeSafe<Equals<U, ThingUpdateType>>();

  assertEquals(expandedSchema, ThingSchema);
});

Deno.test("Schema / Basic datatypes", () => {
  const Prototype = {
    default: x.default,
    string: {
      "@id": x.string,
      "@type": xsd.string,
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
  } as const;

  type PrototypeInterface = {
    $id: string;
    default: string;
    string: string;
    number: number;
    boolean: boolean;
    date: Date;
  };

  type PrototypeUpdateInterface = {
    $id: string;
    default?: string;
    string?: string;
    number?: number;
    boolean?: boolean;
    date?: Date;
  };

  const PrototypeSchema: Schema = {
    "@type": [],
    default: {
      "@id": x.default,
      "@type": xsd.string,
    },
    string: {
      "@id": x.string,
      "@type": xsd.string,
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
  };

  type I = SchemaInterface<typeof Prototype>;
  type U = SchemaUpdateInterface<typeof Prototype>;

  assertTypeSafe<Equals<I, PrototypeInterface>>();
  assertTypeSafe<Equals<U, PrototypeUpdateInterface>>();

  assertEquals(expandSchema(Prototype), PrototypeSchema);
});

Deno.test("Schema / Optional", () => {
  const Prototype = {
    optional: {
      "@id": x.optional,
      "@optional": true,
    },
  } as const;

  type PrototypeInterface = {
    $id: string;
    optional: string | null;
  };

  type PrototypeUpdateInterface = {
    $id: string;
    optional?: string | null;
  };

  const PrototypeSchema: Schema = {
    "@type": [],
    optional: {
      "@id": x.optional,
      "@type": xsd.string,
      "@optional": true,
    },
  };

  type I = SchemaInterface<typeof Prototype>;
  type U = SchemaUpdateInterface<typeof Prototype>;

  assertTypeSafe<Equals<I, PrototypeInterface>>();
  assertTypeSafe<Equals<U, PrototypeUpdateInterface>>();

  assertEquals(expandSchema(Prototype), PrototypeSchema);
});

Deno.test("Schema / Array", () => {
  const Prototype = {
    array: {
      "@id": x.array,
      "@array": true,
    },
    optionalArray: {
      "@id": x.optionalArray,
      "@array": true,
      "@optional": true,
    },
  } as const;

  type PrototypeInterface = {
    $id: string;
    array: string[];
    optionalArray: string[];
  };

  type PrototypeUpdateInterface = {
    $id: string;
    array?: ArrayUpdate<string>;
    optionalArray?: ArrayUpdate<string>;
  };

  const PrototypeSchema: Schema = {
    "@type": [],
    array: {
      "@id": x.array,
      "@type": xsd.string,
      "@array": true,
    },
    optionalArray: {
      "@id": x.optionalArray,
      "@type": xsd.string,
      "@array": true,
      "@optional": true,
    },
  };

  type I = SchemaInterface<typeof Prototype>;
  type U = SchemaUpdateInterface<typeof Prototype>;

  assertTypeSafe<Equals<I, PrototypeInterface>>();
  assertTypeSafe<Equals<U, PrototypeUpdateInterface>>();

  assertEquals(expandSchema(Prototype), PrototypeSchema);
});

Deno.test("Schema / Multilang", () => {
  const Prototype = {
    multilang: {
      "@id": x.multilang,
      "@multilang": true,
    },
    multilangArray: {
      "@id": x.multilangArray,
      "@multilang": true,
      "@array": true,
    },
  } as const;

  type PrototypeInterface = {
    $id: string;
    multilang: Record<string, string>;
    multilangArray: Record<string, string[]>;
  };

  type PrototypeUpdateInterface = {
    $id: string;
    multilang?: Record<string, string>;
    multilangArray?: Record<string, ArrayUpdate<string>>;
  };

  const PrototypeSchema: Schema = {
    "@type": [],
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
  };

  type I = SchemaInterface<typeof Prototype>;
  type U = SchemaUpdateInterface<typeof Prototype>;

  assertTypeSafe<Equals<I, PrototypeInterface>>();
  assertTypeSafe<Equals<U, PrototypeUpdateInterface>>();

  assertEquals(expandSchema(Prototype), PrototypeSchema);
});

Deno.test("Schema / Nested schema", () => {
  const Prototype = {
    nested: {
      "@id": x.nested,
      "@context": {
        "@type": x.Nested,
        nestedValue: x.nestedValue,
      },
    },
  } as const;

  type PrototypeInterface = {
    $id: string;
    nested: {
      $id: string;
      nestedValue: string;
    };
  };

  type PrototypeUpdateInterface = {
    $id: string;
    nested?: {
      $id: string;
      nestedValue?: string;
    };
  };

  const PrototypeSchema: Schema = {
    "@type": [],
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

  type I = SchemaInterface<typeof Prototype>;
  type U = SchemaUpdateInterface<typeof Prototype>;

  assertTypeSafe<Equals<I, PrototypeInterface>>();
  assertTypeSafe<Equals<U, PrototypeUpdateInterface>>();

  assertEquals(expandSchema(Prototype), PrototypeSchema);
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
