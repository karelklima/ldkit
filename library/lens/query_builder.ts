import type { Property, Schema } from "../schema/mod.ts";
import { getSchemaProperties } from "../schema/mod.ts";
import {
  CONSTRUCT,
  DELETE,
  INSERT,
  SELECT,
  sparql as $,
} from "../sparql/mod.ts";
import { type Context, DataFactory, type Iri, type RDF } from "../rdf.ts";
import ldkit from "../namespaces/ldkit.ts";
import rdf from "../namespaces/rdf.ts";

import { encode } from "../encoder.ts";

import type { Entity } from "./types.ts";
import { QueryHelper } from "./query_helper.ts";

export class QueryBuilder {
  private readonly schema: Schema;
  private readonly schemaProperties: Record<string, Property>;
  private readonly context: Context;
  private readonly df: RDF.DataFactory;

  constructor(schema: Schema, context: Context) {
    this.schema = schema;
    this.schemaProperties = getSchemaProperties(this.schema);
    this.context = context;
    this.df = new DataFactory();
  }

  private getResourceSignature() {
    return this.df.quad(
      this.df.variable!("iri"),
      this.df.namedNode(rdf.type),
      this.df.namedNode(ldkit.Resource),
    );
  }

  private getTypesSignature() {
    return this.df.quad(
      this.df.variable!("iri"),
      this.df.namedNode(rdf.type),
      this.df.variable!("iri_type"),
    );
  }

  private entitiesToQuads(entities: Entity[]) {
    const quadArrays = entities.map((entity) =>
      encode(entity, this.schema, this.context)
    );
    return ([] as RDF.Quad[]).concat(...quadArrays);
  }

  private getShape(
    includeOptional = false,
    wrapOptional = true,
    omitRootTypes = false,
  ) {
    const mainVar = "iri";
    const conditions: (RDF.Quad | ReturnType<typeof $>)[] = [];

    const populateConditionsRecursive = (s: Schema, varPrefix: string) => {
      const rdfType = s["@type"];
      const properties = getSchemaProperties(s);

      if (varPrefix !== "iri" || !omitRootTypes) {
        rdfType.forEach((type) => {
          conditions.push(
            this.df.quad(
              this.df.variable!(varPrefix),
              this.df.namedNode(rdf.type),
              this.df.namedNode(type),
            ),
          );
        });
      }

      Object.keys(properties).forEach((prop, index) => {
        const property = properties[prop];
        const isOptional = property["@optional"];
        if (!includeOptional && isOptional) {
          return;
        }
        if (wrapOptional && isOptional) {
          conditions.push($`\nOPTIONAL {`);
        }
        conditions.push(
          this.df.quad(
            this.df.variable!(varPrefix),
            this.df.namedNode(property["@id"]),
            this.df.variable!(`${varPrefix}_${index}`),
          ),
        );
        if (typeof property["@context"] === "object") {
          populateConditionsRecursive(
            property["@context"] as Schema,
            `${varPrefix}_${index}`,
          );
        }
        if (wrapOptional && isOptional) {
          conditions.push($`\n}\n`);
        }
      });
    };

    populateConditionsRecursive(this.schema, mainVar);
    return conditions;
  }

  countQuery() {
    const quads = this.getShape();
    return SELECT`(count(?iri) as ?count)`.WHERE`${quads}`.build();
  }

  getQuery(where?: string | RDF.Quad[], limit = 1000) {
    const selectSubQuery = SELECT.DISTINCT`
      ${this.df.variable!("iri")}
    `.WHERE`
      ${this.getShape(false, true)}
      ${where}
    `.LIMIT(limit).build();

    const query = CONSTRUCT`
      ${this.getResourceSignature()}
      ${this.getShape(true, false, true)}
    `.WHERE`
      ${this.getShape(true, true, true)}
      {
        ${selectSubQuery}
      }
    `.build();

    return query;
  }

  getByIrisQuery(iris: Iri[]) {
    const query = CONSTRUCT`
      ${this.getResourceSignature()}
      ${this.getShape(true, false, true)}
    `.WHERE`
      ${this.getShape(true, true, false)}
      VALUES ?iri {
        ${iris.map(this.df.namedNode)}
      }
    `.build();

    return query;
  }

  insertQuery(entities: Entity[]) {
    const quads = this.entitiesToQuads(entities);
    return this.insertDataQuery(quads);
  }

  insertDataQuery(quads: RDF.Quad[]) {
    return INSERT.DATA`${quads}`.build();
  }

  deleteQuery = (iris: Iri[]) => {
    return DELETE`
      ?s ?p ?o
    `.WHERE`
      ?s ?p ?o .
      VALUES ?s { ${iris.map(this.df.namedNode)} }
    `.build();
  };

  deleteDataQuery(quads: RDF.Quad[]) {
    return DELETE.DATA`${quads}`.build();
  }

  updateQuery(entities: Entity[]) {
    const deleteQuads: RDF.Quad[] = [];
    const insertQuads: RDF.Quad[] = [];
    const whereQuads: RDF.Quad[] = [];

    entities.forEach((entity, index) => {
      const helper = new QueryHelper(
        entity,
        this.schema,
        this.context,
        1000 * index,
      );
      deleteQuads.push(...helper.getDeleteQuads());
      insertQuads.push(...helper.getInsertQuads());
      whereQuads.push(...helper.getWhereQuads());
    });

    return DELETE`${deleteQuads}`.INSERT`${insertQuads}`
      .WHERE`${deleteQuads}`.build();
  }
}
