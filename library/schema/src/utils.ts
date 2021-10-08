import { xsd } from "@ldkit/namespaces";
import type {
  Property,
  PropertyPrototype,
  Schema,
  SchemaPrototype,
} from "./schema";

export const expandSchema = (schemaPrototype: SchemaPrototype) => {
  const expandArray = <T extends string>(stringOrStrings: T | readonly T[]) => {
    return Array.isArray(stringOrStrings) ? stringOrStrings : [stringOrStrings];
  };

  const expandSchemaProperty = (
    stringOrProperty: string | PropertyPrototype
  ) => {
    if (typeof stringOrProperty === "string") {
      return {
        "@id": stringOrProperty,
        "@type": xsd.string,
        "@meta": [],
      };
    }
    const baseProperty: Property = {
      "@id": "",
      "@type": xsd.string,
      "@meta": [],
    };

    return Object.keys(stringOrProperty).reduce((acc, key) => {
      if (key === "@meta") {
        acc[key] = expandArray(stringOrProperty[key]!);
      } else if (key === "@context") {
        acc[key] = expandSchema(stringOrProperty[key]!);
      } else if (key === "@id") {
        acc[key] = stringOrProperty[key]!;
      } else if (key === "@type") {
        acc[key] = stringOrProperty[key]!;
      }
      return acc;
    }, baseProperty);
  };

  const baseSchema: Schema = {
    "@type": [],
  };

  return Object.keys(schemaPrototype).reduce((acc, key) => {
    if (key === "@type") {
      acc[key] = expandArray(schemaPrototype[key]);
    } else {
      acc[key] = expandSchemaProperty(
        schemaPrototype[key] as string | PropertyPrototype
      );
    }
    return acc;
  }, baseSchema);
};

export const getSchemaProperties = (schema: Schema) => {
  const { "@type": ommitedType, ...properties } = schema;
  return properties as Record<string, Property>;
};
