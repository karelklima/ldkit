import {
  assertEquals,
  assertThrows,
  assertTypeSafe,
  type Equals,
} from "./test_deps.ts";
import { x } from "./test_utils.ts";

import { rdf, xsd } from "ldkit/namespaces";
import { type SparqlValue } from "ldkit/sparql";

import {
  ExpandedProperty,
  type ExpandedSchema,
  expandSchema,
  type Schema,
  type SchemaInterface,
  type SchemaSearchInterface,
  type SchemaUpdateInterface,
} from "../library/schema/mod.ts";
import { IRI } from "../library/rdf.ts";

type ArrayUpdate<T> = {
  $set?: T[];
  $add?: T[];
  $remove?: T[];
} | T[];

type PropertySearch<T> = T | {
  $equals?: T;
  $not?: T;
  $contains?: T;
  $strStarts?: T;
  $strEnds?: T;
  $gt?: T;
  $gte?: T;
  $lt?: T;
  $lte?: T;
  $regex?: string;
  $langMatches?: string;
  $in?: T[];
  $notIn?: T[];
  $filter?: SparqlValue;
};

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

  type ThingSearchType = {
    $id?: IRI | IRI[];
    required?: PropertySearch<string>;
    optional?: PropertySearch<string>;
    array?: PropertySearch<string>;
    multilang?: PropertySearch<string>;
    multilangArray?: PropertySearch<string>;
    number?: PropertySearch<number>;
    boolean?: PropertySearch<boolean>;
    date?: PropertySearch<Date>;
    nested?: {
      nestedValue?: PropertySearch<string>;
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
      "@schema": {
        "@type": x.Nested,
        nestedValue: x.nestedValue,
      },
    },
  } as const;

  const ThingSchema: ExpandedSchema = {
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
      "@schema": {
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
  type S = SchemaSearchInterface<typeof Thing>;

  assertTypeSafe<Equals<I, ThingType>>();
  assertTypeSafe<Equals<U, ThingUpdateType>>();
  assertTypeSafe<Equals<S, ThingSearchType>>();

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

  type PrototypeSearchInterface = {
    $id?: IRI | IRI[];
    default?: PropertySearch<string>;
    string?: PropertySearch<string>;
    number?: PropertySearch<number>;
    boolean?: PropertySearch<boolean>;
    date?: PropertySearch<Date>;
  };

  const PrototypeSchema: ExpandedSchema = {
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
  type S = SchemaSearchInterface<typeof Prototype>;

  assertTypeSafe<Equals<I, PrototypeInterface>>();
  assertTypeSafe<Equals<U, PrototypeUpdateInterface>>();
  assertTypeSafe<Equals<S, PrototypeSearchInterface>>();

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

  type PrototypeSearchInterface = {
    $id?: IRI | IRI[];
    optional?: PropertySearch<string>;
  };

  const PrototypeSchema: ExpandedSchema = {
    "@type": [],
    optional: {
      "@id": x.optional,
      "@type": xsd.string,
      "@optional": true,
    },
  };

  type I = SchemaInterface<typeof Prototype>;
  type U = SchemaUpdateInterface<typeof Prototype>;
  type S = SchemaSearchInterface<typeof Prototype>;

  assertTypeSafe<Equals<I, PrototypeInterface>>();
  assertTypeSafe<Equals<U, PrototypeUpdateInterface>>();
  assertTypeSafe<Equals<S, PrototypeSearchInterface>>();

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

  type PrototypeSearchInterface = {
    $id?: IRI | IRI[];
    array?: PropertySearch<string>;
    optionalArray?: PropertySearch<string>;
  };

  const PrototypeSchema: ExpandedSchema = {
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
  type S = SchemaSearchInterface<typeof Prototype>;

  assertTypeSafe<Equals<I, PrototypeInterface>>();
  assertTypeSafe<Equals<U, PrototypeUpdateInterface>>();
  assertTypeSafe<Equals<S, PrototypeSearchInterface>>();

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

  type PrototypeSearchInterface = {
    $id?: IRI | IRI[];
    multilang?: PropertySearch<string>;
    multilangArray?: PropertySearch<string>;
  };

  const PrototypeSchema: ExpandedSchema = {
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
  type S = SchemaSearchInterface<typeof Prototype>;

  assertTypeSafe<Equals<I, PrototypeInterface>>();
  assertTypeSafe<Equals<U, PrototypeUpdateInterface>>();
  assertTypeSafe<Equals<S, PrototypeSearchInterface>>();

  assertEquals(expandSchema(Prototype), PrototypeSchema);
});

Deno.test("Schema / Inverse", () => {
  const Prototype = {
    isPropertyOf: {
      "@id": x.property,
      "@inverse": true,
    },
  } as const;

  type PrototypeInterface = {
    $id: string;
    isPropertyOf: string;
  };

  type PrototypeUpdateInterface = {
    $id: string;
    isPropertyOf?: string;
  };

  type PrototypeSearchInterface = {
    $id?: IRI | IRI[];
  };

  const PrototypeSchema: ExpandedSchema = {
    "@type": [],
    isPropertyOf: {
      "@id": x.property,
      "@type": xsd.string,
      "@inverse": true,
    },
  };

  type I = SchemaInterface<typeof Prototype>;
  type U = SchemaUpdateInterface<typeof Prototype>;
  type S = SchemaSearchInterface<typeof Prototype>;

  assertTypeSafe<Equals<I, PrototypeInterface>>();
  assertTypeSafe<Equals<U, PrototypeUpdateInterface>>();
  assertTypeSafe<Equals<S, PrototypeSearchInterface>>();

  assertEquals(expandSchema(Prototype), PrototypeSchema);
});

Deno.test("Schema / Nested schema", () => {
  const Prototype = {
    nested: {
      "@id": x.nested,
      "@schema": {
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

  type PrototypeSearchInterface = {
    $id?: IRI | IRI[];
    nested?: {
      nestedValue?: PropertySearch<string>;
    };
  };

  const PrototypeSchema: ExpandedSchema = {
    "@type": [],
    nested: {
      "@id": x.nested,
      "@schema": {
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
  type S = SchemaSearchInterface<typeof Prototype>;

  assertTypeSafe<Equals<I, PrototypeInterface>>();
  assertTypeSafe<Equals<U, PrototypeUpdateInterface>>();
  assertTypeSafe<Equals<S, PrototypeSearchInterface>>();

  assertEquals(expandSchema(Prototype), PrototypeSchema);
});

Deno.test("Schema / should have at least one property or @type restriction", () => {
  assertThrows(() => {
    expandSchema(undefined as unknown as Schema);
  });
  assertThrows(() => {
    expandSchema({} as unknown as Schema);
  });
});

Deno.test("Schema / should expand @type shortcut definition", () => {
  const schema = {
    type: "@type",
  } as const;
  const expandedSchema = expandSchema(schema);
  assertEquals((expandedSchema["type"] as ExpandedProperty)["@id"], rdf.type);
});

Deno.test("Schema / should expand @type property definition", () => {
  const schema = {
    "type": { "@id": "@type" },
  } as const;
  const expandedSchema = expandSchema(schema);
  assertEquals((expandedSchema["type"] as ExpandedProperty)["@id"], rdf.type);
});

Deno.test("Schema / should throw if @inverse @multilang is defined", () => {
  const schema = {
    property: {
      "@id": x.property,
      "@inverse": true,
      "@multilang": true,
    },
  } as const;
  assertThrows(() => {
    expandSchema(schema);
  });
});

Deno.test("Schema / should throw if two properties with the same @id are defined", () => {
  const schema = {
    property: {
      "@id": x.property,
    },
    property2: {
      "@id": x.property,
    },
  } as const;
  assertThrows(() => {
    expandSchema(schema);
  });
});
