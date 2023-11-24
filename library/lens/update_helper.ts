import type { Context, RDF } from "../rdf.ts";
import {
  getSchemaProperties,
  type Property,
  type Schema,
} from "../schema/mod.ts";
import { encode } from "../encoder.ts";
import type { Entity } from "./types.ts";

export class UpdateHelper {
  private readonly schema: Schema;
  private readonly properties: Record<string, Property>;
  private readonly context: Context;

  private variableCounter = 0;

  public readonly deleteQuads: RDF.Quad[] = [];
  public readonly insertQuads: RDF.Quad[] = [];
  public readonly whereQuads: RDF.Quad[] = [];

  constructor(
    schema: Schema,
    context: Context,
    variableInitCounter = 0,
  ) {
    this.schema = schema;
    this.properties = getSchemaProperties(schema);
    this.context = context;
    this.variableCounter = variableInitCounter;
  }

  public process(entity: Entity) {
    for (const name in this.properties) {
      this.processProperty(entity, name, this.properties[name]);
    }
  }

  private processProperty(
    entity: Entity,
    propertyName: string,
    property: Property,
  ) {
    this.variableCounter++;

    const value = entity[propertyName];

    if (value === undefined) {
      return;
    }

    if (property["@array"]) {
      this.processArrayProperty(entity, propertyName, value);
    } else {
      this.processSingleProperty(entity, propertyName, value, property);
    }
  }

  private processSingleProperty(
    entity: Entity,
    propertyName: string,
    propertyValue: unknown,
    property: Property,
  ) {
    const deletePattern = {
      $id: entity.$id,
      [propertyName]: null,
    };
    const quadsToDelete = this.encode(deletePattern);
    this.deleteQuads.push(...quadsToDelete);

    if (property["@optional"] && propertyValue === null) {
      // The intention was to delete a value of an optional property, nothing to insert
      return;
    }

    const insertPattern = {
      $id: entity.$id,
      [propertyName]: propertyValue,
    };
    const quadsToInsert = this.encode(insertPattern);
    this.insertQuads.push(...quadsToInsert);
  }

  private processArrayProperty(
    entity: Entity,
    propertyName: string,
    propertyValue: unknown,
  ) {
    const config = this.parseArrayUpdateConfig(propertyValue);
    if (config.$set) {
      this.processArraySet(entity, propertyName, config.$set);
    } else {
      this.processArrayAddRemove(
        entity,
        propertyName,
        config.$add,
        config.$remove,
      );
    }
  }

  private processArraySet(
    entity: Entity,
    propertyName: string,
    propertyValue: unknown[],
  ) {
    const deletePattern = {
      $id: entity.$id,
      [propertyName]: null,
    };
    const quadsToDelete = this.encode(deletePattern);
    this.deleteQuads.push(...quadsToDelete);

    const insertPattern = {
      $id: entity.$id,
      [propertyName]: propertyValue,
    };
    const quadsToInsert = this.encode(insertPattern);
    this.insertQuads.push(...quadsToInsert);
  }

  private processArrayAddRemove(
    entity: Entity,
    propertyName: string,
    $add: unknown[] | undefined,
    $remove: unknown[] | undefined,
  ) {
    if ($remove) {
      const deletePattern = {
        $id: entity.$id,
        [propertyName]: $remove,
      };
      const quadsToDelete = this.encode(deletePattern);
      this.deleteQuads.push(...quadsToDelete);
    }

    if ($add) {
      const insertPattern = {
        $id: entity.$id,
        [propertyName]: $add,
      };
      const quadsToInsert = this.encode(insertPattern);
      this.insertQuads.push(...quadsToInsert);
    }
  }

  private parseArrayUpdateConfig(
    config: unknown,
  ): Record<"$add" | "$set" | "$remove", unknown[] | undefined> {
    if (Array.isArray(config)) {
      return { $set: config, $add: undefined, $remove: undefined };
    }
    if (config == null || typeof config !== "object") {
      throw new Error(
        "Invalid array update query, expected an array, or an object with $add, $set, or $remove properties",
      );
    }

    const { $add, $set, $remove } = config as Record<
      string,
      unknown[] | undefined
    >;

    switch (true) {
      case Array.isArray($set) && $add === undefined && $remove === undefined:
      case $set === undefined && Array.isArray($add) && $remove === undefined:
      case $set === undefined && $add === undefined && Array.isArray($remove):
      case $set === undefined && Array.isArray($add) && Array.isArray($remove):
        return { $add, $set, $remove };
    }

    throw new Error(
      "Invalid array update query, expected an array, or an object with $add, $set, or $remove properties",
    );
  }

  private encode(entity: Entity) {
    return encode(
      entity,
      this.schema,
      this.context,
      false,
      this.variableCounter,
    );
  }
}