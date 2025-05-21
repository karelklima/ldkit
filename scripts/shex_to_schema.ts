import ShexParser from "https://esm.sh/@shexjs/parser@1.0.0-alpha.28";

import { PropertySpec, SchemaSpec } from "./schema_to_script.ts";
import type {
  IRIREF,
  Schema as ShexSchema,
  ShapeDecl,
  shapeExpr,
  shapeExprOrRef,
  tripleExpr,
  tripleExprOrRef,
} from "./shexj_types.ts";
import { ldkit, rdf } from "../namespaces.ts";

export function shexcToShexj(shexc: string): ShexSchema {
  // Parse the Shexc string using the ShexJS parser
  const baseIri = "";
  return ShexParser.construct(baseIri).parse(shexc);
}

export function shexjToSchema(shexj: ShexSchema): SchemaSpec[] {
  const converter = new ShexConverter();
  return converter.process(shexj);
}

export function shexcToSchema(shexc: string): SchemaSpec[] {
  const shexj = shexcToShexj(shexc);
  console.log("shexj", JSON.stringify(shexj, null, 2));
  return shexjToSchema(shexj);
}

type Context = {
  schema?: SchemaSpec;
  property?: PropertySpec;
  type?: true;
  optional?: true;
  shapeAnd?: true;
  shapeOr?: true;
};

type Node =
  | ShexSchema
  | ShapeDecl
  | ShapeDecl[]
  | shapeExpr
  | shapeExpr[]
  | tripleExpr
  | tripleExpr[];
type NodeOrRef =
  | Node
  | shapeExprOrRef
  | shapeExprOrRef[]
  | tripleExprOrRef
  | tripleExprOrRef[];

class ShexConverter {
  private schemas = new Map<string, SchemaSpec>();

  private shexj!: ShexSchema;
  private idMapping = new Map<string, unknown>();

  public process(shexj: ShexSchema): SchemaSpec[] {
    this.shexj = shexj;

    this.buildIdMapping();

    this.visit(this.shexj, {});

    return [...this.schemas.values()];
  }

  private visit(nodeOrRef: NodeOrRef | undefined, context: Context) {
    if (nodeOrRef === undefined) {
      return;
    }

    const isRef = typeof nodeOrRef === "string";
    const node = isRef ? this.idMapping.get(nodeOrRef) as Node : nodeOrRef;

    if (typeof node !== "object" || node === null) {
      return;
    }

    if (Array.isArray(node)) {
      for (const item of node) {
        this.visit(item, context);
      }
      return;
    }

    switch (node.type) {
      case "Schema":
        if (!node.shapes) {
          throw new Error("No shapes found in ShexJ schema");
        }
        this.visit(node.shapes, {});
        break;
      case "ShapeDecl":
        if (context.shapeAnd || context.shapeOr) {
          this.visit(node.shapeExpr, context);
        } else if (isRef) {
          context.property!.schemaRef = this.getSuffix(node.id);
        } else {
          const schema = this.createSchema(node.id);
          this.visit(node.shapeExpr, { schema });
        }
        break;
      case "Shape":
        if (context.property) {
          const schema = this.createAnonymousSchema();
          context.property.schema = schema;
          this.visit(node.expression, {
            ...context,
            property: undefined,
            schema,
          });
        } else {
          this.visit(node.expression, context);
        }
        break;
      case "ShapeAnd": {
        const root = !context.shapeAnd && !context.shapeOr;

        const schema = root ? this.createAnonymousSchema() : context.schema;
        if (root) {
          if (context.property) {
            context.property.schema = schema;
          }
          this.visit(node.shapeExprs, {
            schema,
            shapeAnd: true,
          });
        } else {
          this.visit(node.shapeExprs, { ...context, shapeAnd: true, schema });
        }
        break;
      }
      case "ShapeOr": {
        const root = !context.shapeAnd && !context.shapeOr;

        const schema = root ? this.createAnonymousSchema() : context.schema;
        if (root) {
          if (context.property) {
            context.property.schema = schema;
          }
          this.visit(node.shapeExprs, {
            schema,
            shapeOr: true,
          });
        } else {
          this.visit(node.shapeExprs, { ...context, shapeOr: true, schema });
        }
        break;
      }
      case "EachOf":
        this.visit(node.expressions, context);
        break;
      case "OneOf":
        this.visit(node.expressions, { ...context, optional: true });
        break;
      case "TripleConstraint": {
        if (node.predicate === rdf.type) {
          if (!context.shapeOr) {
            this.visit(node.valueExpr, { ...context, type: true });
          }
          break;
        }
        const property: PropertySpec = {
          id: node.predicate,
        };
        if (node.min === 0 || context.optional || context.shapeOr) {
          property.optional = true;
        }
        if (node.max && node.max > 1 || node.max === -1) {
          property.array = true;
        }
        if (node.inverse) {
          property.inverse = true;
        }
        const name = this.getSuffix(node.predicate);
        context.schema!.properties[name] = property;
        this.visit(node.valueExpr, { ...context, property });
        break;
      }
      case "NodeConstraint": {
        if (context.type) {
          if (node.values?.length) {
            context.schema!.type.push(node.values[0] as IRIREF);
          }
        } else if (context.property) {
          const property = context.property;
          if (node.nodeKind === "iri") { // IRI
            property.type = ldkit.IRI;
          } else if (node.datatype) { // literal
            property.type = node.datatype;
          } else if (node.values?.length) { // enumeration
            const first = node.values[0];
            if (typeof first === "string") {
              property.type = ldkit.IRI;
            } else if (typeof first === "object" && first.type !== undefined) {
              property.type = first.type;
            }
          }
        }
        break;
      }
    }
  }

  private createSchema(id: string) {
    if (this.schemas.has(id)) {
      throw new Error(`Duplicate schema ID: ${id}`);
    }

    const name = this.getSuffix(id);
    const schema: SchemaSpec = {
      name,
      type: [],
      properties: {},
    };
    this.schemas.set(id, schema);
    return schema;
  }

  private createAnonymousSchema() {
    return {
      name: "AnonymousSchema",
      type: [],
      properties: {},
    };
  }

  private buildIdMapping() {
    const queue: unknown[] = [this.shexj];

    while (queue.length > 0) {
      const current = queue.shift();
      if (Array.isArray(current)) {
        for (const item of current) {
          queue.push(item);
        }
      } else if (typeof current === "object" && current !== null) {
        for (const [key, value] of Object.entries(current)) {
          if (key === "id") {
            this.idMapping.set(value, current);
          } else if (typeof value === "object") {
            queue.push(value);
          }
        }
      }
    }
  }

  private getSuffix(value: string): string {
    const cutoff = Math.max(value.lastIndexOf("#"), value.lastIndexOf("/"));
    if (cutoff === -1) {
      return value;
    }
    return value.substring(cutoff + 1);
  }
}
