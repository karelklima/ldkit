import type { Property, Schema } from "@ldkit/schema";
import { getSchemaProperties } from "@ldkit/schema";
import { $, CONSTRUCT, SELECT, INSERT, DELETE } from "@ldkit/sparql";
import { Quad, variable, namedNode, quad, Iri } from "@ldkit/rdf";
import { rdf, ldkit } from "@ldkit/namespaces";
import { encode } from "@ldkit/encoder";
import type { Context } from "@ldkit/context";
import type { Entity } from "./types";
import { QueryHelper } from "./query-helper";

export class QueryBuilder {
  private readonly schema: Schema;
  private readonly schemaProperties: Record<string, Property>;
  private readonly context: Context;

  constructor(schema: Schema, context: Context) {
    this.schema = schema;
    this.schemaProperties = getSchemaProperties(this.schema);
    this.context = context;
  }

  private getResourceSignature() {
    return quad(
      variable("iri"),
      namedNode(rdf.type),
      namedNode(ldkit.Resource)
    );
  }

  private entitiesToQuads(entities: Entity[]) {
    const quadArrays = entities.map((entity) =>
      encode(entity, this.schema, this.context)
    );
    return ([] as Quad[]).concat(...quadArrays);
  }

  private getShape(
    mainVar = "iri",
    includeOptional = false,
    wrapOptional = true,
    setSpecificTypes = true
  ) {
    const conditions: (Quad | ReturnType<typeof $>)[] = [];

    const populateConditionsRecursive = (s: Schema, varPrefix: string) => {
      const rdfType = s["@type"];
      const properties = getSchemaProperties(s);

      if (setSpecificTypes) {
        rdfType.forEach((type) => {
          conditions.push(
            quad(variable(varPrefix), namedNode(rdf.type), namedNode(type))
          );
        });
      } else {
        conditions.push(
          quad(
            variable(varPrefix),
            namedNode(rdf.type),
            variable(`${varPrefix}_type`)
          )
        );
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
          quad(
            variable(varPrefix),
            namedNode(property["@id"]),
            variable(`${varPrefix}_${index}`)
          )
        );
        if (typeof property["@context"] === "object") {
          populateConditionsRecursive(
            property["@context"] as Schema,
            `${varPrefix}_${index}`
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

  getQuery(where?: string | Quad[], limit = 1000) {
    const selectSubQuery = SELECT`
      ${variable("iri")}
    `.WHERE`
      ${this.getShape("iri", false)}
      ${where}
    `.LIMIT(limit);

    const query = CONSTRUCT`
      ${this.getResourceSignature()}
      ${this.getShape("iri", true, false, false)}
    `.WHERE`
      ${this.getShape("iri", true, true, false)}
      {
        ${selectSubQuery}
      }
    `.build();

    return query;
  }

  getByIrisQuery(iris: Iri[]) {
    const query = CONSTRUCT`
      ${this.getResourceSignature()}
      ${this.getShape("iri", true, false, false)}
    `.WHERE`
      ${this.getShape("iri", true, true, false)}
      VALUES ?iri {
        ${iris.map(namedNode)}
      }
    `.build();

    return query;
  }

  insertQuery(entities: Entity[]) {
    const quads = this.entitiesToQuads(entities);
    return this.insertDataQuery(quads);
  }

  insertDataQuery(quads: Quad[]) {
    return INSERT.DATA`${quads}`.build();
  }

  deleteQuery = (iris: Iri[]) => {
    return DELETE`
      ?s ?p ?o
    `.WHERE`
      ?s ?p ?o .
      VALUES ?s { ${iris.map(namedNode)} }
    `.build();
  };

  deleteDataQuery(quads: Quad[]) {
    return $`DELETE DATA { ${quads} }`.toString();
  }

  updateQuery(entities: Entity[]) {
    const deleteQuads: Quad[] = [];
    const insertQuads: Quad[] = [];
    const whereQuads: Quad[] = [];

    entities.forEach((entity, index) => {
      const helper = new QueryHelper(
        entity,
        this.schema,
        this.context,
        1000 * index
      );
      deleteQuads.push(...helper.getDeleteQuads());
      insertQuads.push(...helper.getInsertQuads());
      whereQuads.push(...helper.getWhereQuads());
    });

    return DELETE`${deleteQuads}`.INSERT`${insertQuads}`
      .WHERE`${deleteQuads}`.build();
  }
}
