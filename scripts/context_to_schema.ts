import { ContextParser } from "npm:jsonld-context-parser@^3";

import { type PropertySpec, type SchemaSpec } from "./schema_to_script.ts";

type JsonPrimative = string | number | boolean | null;
type JsonArray = Json[];
type JsonObject = { [key: string]: Json };
type JsonComposite = JsonArray | JsonObject;
type Json = JsonPrimative | JsonComposite;
export type JsonSpec = JsonComposite;

export async function contextToSchema(json: JsonSpec): Promise<SchemaSpec[]> {
  const converter = new ContextConverter();
  const schemas = await converter.process(json);
  return schemas;
}

class ContextConverter {
  private readonly parser = new ContextParser();
  private schemaNames = new Set<string>();
  private schemas: SchemaSpec[] = [];

  private getSuffix(value: string): string {
    const cutoff = Math.max(value.lastIndexOf("#"), value.lastIndexOf("/"));
    if (cutoff === -1) {
      return value;
    }
    return value.substring(cutoff + 1);
  }

  private capitalize(val: string): string {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
  }

  private generateSchemaName(context: JsonObject, key: string): string {
    const types = context["@type"];

    const wrap = (val: string) => `${this.capitalize(val)}Schema`;

    if (typeof types === "string") {
      return wrap(this.getSuffix(types));
    } else if (Array.isArray(types)) {
      const suffixes = types.map((type) => this.getSuffix(type as string));
      return wrap(suffixes.join(""));
    }

    return wrap(key);
  }

  private generateUniqueSchemaName(context: JsonObject, key: string): string {
    const name = this.generateSchemaName(context, key);
    if (!this.schemaNames.has(name)) {
      this.schemaNames.add(name);
      return name;
    }
    for (let i = 1; i < 100; i++) {
      const newName = `${name}${i}`;
      if (!this.schemaNames.has(newName)) {
        this.schemaNames.add(newName);
        return newName;
      }
    }
    throw new Error("Too many schemas with the same name");
  }

  private createSchema(context: JsonObject, key: string): SchemaSpec {
    const name = this.generateUniqueSchemaName(context, key);
    const schema: SchemaSpec = {
      name,
      type: [],
      properties: {},
    };
    this.schemaNames.add(name);
    this.schemas.push(schema);
    return schema;
  }

  public async process(json: JsonSpec): Promise<SchemaSpec[]> {
    const parsed = await this.parser.parse(json, { external: false });
    const context = parsed.getContextRaw();

    const schema = this.createSchema(context, "The");

    await this.processSchema(context, context, schema);

    return this.schemas;
  }

  private async processSchema(
    context: JsonObject,
    contextFull: JsonObject,
    schema: SchemaSpec,
  ) {
    const types = context["@type"];
    if (typeof types === "string") {
      schema.type.push(types);
    } else if (Array.isArray(types)) {
      for (const type of types) {
        if (typeof type === "string") {
          schema.type.push(type);
        }
      }
    }

    for (const [key, prop] of Object.entries(context)) {
      if (prop === undefined || prop === null || key.startsWith("@")) {
        // Ignore undefined, null, and special properties
        continue;
      }

      if (
        typeof prop === "string" &&
        (prop.endsWith("/") || prop.endsWith("#") || prop.startsWith("@"))
      ) {
        // Ignore prefixes and remapping of special properties
        continue;
      }

      if (typeof prop === "string") {
        schema.properties[key] = {
          id: prop,
        };
        continue;
      }

      if (typeof prop !== "object" || Array.isArray(prop)) {
        // This should not happen, but just in case
        continue;
      }

      schema.properties[key] = await this.processProperty(
        contextFull,
        key,
        prop,
      );
    }

    return schema;
  }

  private async processProperty(
    context: JsonObject,
    key: string,
    prop: JsonObject,
  ): Promise<PropertySpec> {
    const property: PropertySpec = {
      id: prop["@id"] as string,
    };

    if (typeof prop["@type"] === "string") {
      property.type = prop["@type"];
    }

    if (prop["@context"] && typeof prop["@context"] === "object") {
      const parsed = await this.parser.parse(
        prop["@context"] as JsonComposite,
        {
          external: false,
          parentContext: context,
        },
      );
      const subcontextFull = parsed.getContextRaw();

      const subcontext = {} as Record<string, JsonComposite>;
      for (const [key, _value] of Object.entries(prop["@context"])) {
        subcontext[key] = subcontextFull[key];
      }

      const subschema = this.createSchema(subcontext, key);
      await this.processSchema(subcontext, subcontextFull, subschema);
      property.schemaRef = subschema.name;
    }

    const containers = (prop["@container"] || {}) as Record<string, boolean>;

    if (containers["@set"] || containers["@list"]) {
      property.array = true;
    }
    if (containers["@language"]) {
      property.multilang = true;
    }

    if (prop["@reverse"]) {
      property.inverse = true;
    }

    return property;
  }
}
