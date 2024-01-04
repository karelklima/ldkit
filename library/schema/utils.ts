import rdf from "../namespaces/rdf.ts";
import xsd from "../namespaces/xsd.ts";

import type {
  ExpandedProperty,
  ExpandedSchema,
  Property,
  Schema,
} from "./schema.ts";

export const expandSchema = (schemaPrototype: Schema) => {
  if (typeof schemaPrototype !== "object") {
    throw new Error(`Invalid schema, expected object`);
  }

  if (Object.keys(schemaPrototype).length === 0) {
    throw new Error(
      `Invalid schema, empty object, expected "@type" key or property definition`,
    );
  }

  const expandShortcut = (value: string) => {
    return value === "@type" ? rdf.type : value;
  };

  const expandArray = <T extends string>(stringOrStrings: T | readonly T[]) => {
    return Array.isArray(stringOrStrings) ? stringOrStrings : [stringOrStrings];
  };

  const expandSchemaProperty = (
    stringOrProperty: string | Property,
  ) => {
    if (typeof stringOrProperty === "string") {
      return {
        "@id": expandShortcut(stringOrProperty),
        "@type": xsd.string,
      };
    }

    const property = stringOrProperty;

    if (!property["@id"]) {
      throw new Error(`Invalid schema, "@id" key for property missing`);
    }

    if (property["@inverse"] && property["@multilang"]) {
      throw new Error(
        `Invalid schema, "@inverse" property cannot be used with "@multilang"`,
      );
    }

    const validKeys = [
      "@schema",
      "@id",
      "@type",
      "@array",
      "@optional",
      "@multilang",
      "@inverse",
    ] as const;

    const baseProperty: Record<string, unknown> = {
      "@id": "",
    };

    const expandedProperty = Object.keys(property).reduce((acc, key) => {
      if (key === "@schema") {
        acc[key] = expandSchema(property[key]!);
      } else if (key === "@id") {
        acc[key] = expandShortcut(property[key]);
      } else if (validKeys.includes(key as keyof Property)) {
        acc[key] = property[key as keyof Property] as unknown;
      }
      return acc;
    }, baseProperty);

    if (!baseProperty["@type"] && !baseProperty["@schema"]) {
      baseProperty["@type"] = xsd.string;
    }

    return expandedProperty as ExpandedProperty;
  };

  const baseSchema: ExpandedSchema = {
    "@type": [] as string[],
  };

  const existingPropertyMap = {} as Record<string, true | undefined>;

  return Object.keys(schemaPrototype).reduce((acc, key) => {
    if (key === "@type") {
      acc[key] = expandArray(schemaPrototype[key]!);
    } else {
      const expandedProperty = expandSchemaProperty(
        schemaPrototype[key] as string | Property,
      );
      if (existingPropertyMap[expandedProperty["@id"]]) {
        throw new Error(
          `Invalid schema, duplicate property "${expandedProperty["@id"]}"`,
        );
      } else {
        existingPropertyMap[expandedProperty["@id"]] = true;
      }
      acc[key] = expandedProperty;
    }
    return acc;
  }, baseSchema);
};

export const getSchemaProperties = (schema: ExpandedSchema) => {
  const { "@type": _ommitedType, ...properties } = schema;
  return properties as Record<string, ExpandedProperty>;
};
