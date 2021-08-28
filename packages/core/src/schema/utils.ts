import { xsd } from "@ldkit/namespaces";
import { $CONTEXT, $ID, $META, $TYPE } from "./keys";
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
        [$ID]: stringOrProperty,
        [$TYPE]: xsd.string,
        [$META]: [],
      };
    }
    const baseProperty: Property = {
      [$ID]: "",
      [$TYPE]: xsd.string,
      [$META]: [],
    };

    return Object.keys(stringOrProperty).reduce((acc, key) => {
      if (key === $META) {
        acc[key] = expandArray(stringOrProperty[key]!);
      } else if (key === $CONTEXT) {
        acc[key] = expandSchema(stringOrProperty[key]!);
      } else if (key === $ID || key === $TYPE) {
        // ID, TYPE
        acc[key] = stringOrProperty[key]!;
      }
      return acc;
    }, baseProperty);
  };

  const baseSchema: Schema = {
    [$TYPE]: [],
  };

  return Object.keys(schemaPrototype).reduce((acc, key) => {
    if (key === $TYPE) {
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
  const { [$TYPE]: ommitedType, ...properties } = schema;
  return properties as Record<string, Property>;
};
