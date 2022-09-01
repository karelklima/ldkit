import type { Context } from "../context.ts";
import type { Property, Schema } from "../schema/mod.ts";
import type { Quad } from "../rdf.ts";
import { encode } from "../encoder.ts";
import type { Entity } from "./types.ts";

export class QueryHelper {
  private readonly entity: Entity;
  private readonly schema: Schema;
  private readonly context: Context;
  private readonly variableInitCounter: number;

  private quads?: Quad[];
  private variableQuads?: Quad[];

  constructor(
    entity: Entity,
    schema: Schema,
    context: Context,
    variableInitCounter = 0
  ) {
    this.entity = entity;
    this.schema = schema;
    this.context = context;
    this.variableInitCounter = variableInitCounter;
  }

  getQuads() {
    if (!this.quads) {
      this.quads = encode(
        this.entity,
        this.schema,
        this.context,
        this.variableInitCounter
      );
    }
    return this.quads;
  }

  getVariableQuads() {
    if (!this.variableQuads) {
      this.variableQuads = encode(
        this.getEntityWithReplacedVariables(),
        this.schema,
        this.context,
        this.variableInitCounter
      );
    }
    return this.variableQuads;
  }

  getDeleteQuads() {
    return this.getVariableQuads().filter(
      (quad) => quad.object.termType === "Variable"
    );
  }

  getInsertQuads() {
    return this.getQuads();
  }

  getWhereQuads() {
    return this.getVariableQuads();
  }

  private getEntityWithReplacedVariables() {
    return this.replaceVariables(this.entity, this.schema);
  }

  private replaceVariables(entity: Entity, schema: Schema) {
    return Object.keys(entity).reduce((output, key) => {
      const value = entity[key];

      if (key === "$id") {
        output.$id = value;
        return output;
      }
      if (key === "$type") {
        output.$type = value;
        return output;
      }

      const property = schema[key] as Property;
      if (!property) {
        throw new Error("Unknown field '${key}' detected in entity");
      }

      if (!property["@context"]) {
        output[key] = null;
        return output;
      }

      if (property["@array"]) {
        if (value.length === 0) {
          output[key] = null;
        } else {
          output[key] = value.map((subEntity: Entity) =>
            this.replaceVariables(subEntity, property["@context"]!)
          );
        }
      } else {
        output[key] = this.replaceVariables(
          value as Entity,
          property["@context"]
        );
      }

      return output;
    }, {} as Entity);
  }
}
