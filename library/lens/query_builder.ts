import {
  getSchemaProperties,
  type Property,
  type Schema,
  type SearchSchema,
} from "../schema/mod.ts";
import {
  CONSTRUCT,
  DELETE,
  INSERT,
  SELECT,
  sparql as $,
  type SparqlValue,
} from "../sparql/mod.ts";
import { type Context, DataFactory, type Iri, type RDF } from "../rdf.ts";
import ldkit from "../namespaces/ldkit.ts";
import rdf from "../namespaces/rdf.ts";

import { encode } from "../encoder.ts";

import { type Entity } from "./types.ts";
import { UpdateHelper } from "./update_helper.ts";
import { SearchHelper } from "./search_helper.ts";

enum Flags {
  None = 0,
  ExcludeOptional = 1 << 0,
  UnwrapOptional = 1 << 1,
  IncludeTypes = 1 << 2,
  IgnoreInverse = 1 << 3,
}

export class QueryBuilder {
  private readonly schema: Schema;
  private readonly context: Context;
  private readonly takeDefault: number;
  private readonly df: RDF.DataFactory;

  constructor(schema: Schema, context: Context) {
    this.schema = schema;
    this.context = context;
    this.takeDefault = 1000;
    this.df = new DataFactory();
  }

  private getResourceSignature() {
    return this.df.quad(
      this.df.variable!("iri"),
      this.df.namedNode(rdf.type),
      this.df.namedNode(ldkit.Resource),
    );
  }

  private entitiesToQuads(entities: Entity[]) {
    const quadArrays = entities.map((entity) =>
      encode(entity, this.schema, this.context)
    );
    return ([] as RDF.Quad[]).concat(...quadArrays);
  }

  private getShape(flags: Flags, searchSchema?: SearchSchema) {
    const includeOptional = (flags & Flags.ExcludeOptional) === 0;
    const wrapOptional = (flags & Flags.UnwrapOptional) === 0;
    const omitRootTypes = (flags & Flags.IncludeTypes) === 0;
    const ignoreInverse = (flags & Flags.IgnoreInverse) === Flags.IgnoreInverse;

    const mainVar = "iri";
    const conditions: SparqlValue[] = [];

    const populateSearchConditions = (
      property: Property,
      varName: string,
      search?: SearchSchema,
    ) => {
      if (search === undefined) {
        return;
      }
      const helper = new SearchHelper(property, varName, search);
      helper.process();
      conditions.push(helper.sparqlValues);
    };

    const populateConditionsRecursive = (
      s: Schema,
      varPrefix: string,
      search?: SearchSchema,
    ) => {
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
        const propertySchema = search?.[prop] as SearchSchema | undefined;
        if (!includeOptional && isOptional && propertySchema === undefined) {
          return;
        }
        if (wrapOptional && isOptional) {
          conditions.push($`\nOPTIONAL {`);
        }
        const isInverse = property["@inverse"];
        if (ignoreInverse || !isInverse) {
          conditions.push(
            this.df.quad(
              this.df.variable!(varPrefix),
              this.df.namedNode(property["@id"]),
              this.df.variable!(`${varPrefix}_${index}`),
            ),
          );
          populateSearchConditions(
            property,
            `${varPrefix}_${index}`,
            propertySchema,
          );
        } else {
          conditions.push(
            this.df.quad(
              this.df.variable!(`${varPrefix}_${index}`),
              this.df.namedNode(property["@id"]),
              this.df.variable!(varPrefix),
            ),
          );
        }
        if (typeof property["@schema"] === "object") {
          populateConditionsRecursive(
            property["@schema"] as Schema,
            `${varPrefix}_${index}`,
            propertySchema,
          );
        }
        if (wrapOptional && isOptional) {
          conditions.push($`\n}\n`);
        }
      });
    };

    populateConditionsRecursive(this.schema, mainVar, searchSchema);
    return conditions;
  }

  countQuery() {
    const quads = this.getShape(Flags.ExcludeOptional | Flags.IncludeTypes);
    return SELECT`(count(?iri) as ?count)`.WHERE`${quads}`.build();
  }

  getQuery(where?: string | RDF.Quad[], limit = this.takeDefault, offset = 0) {
    const selectSubQuery = SELECT.DISTINCT`
      ${this.df.variable!("iri")}
    `.WHERE`
      ${this.getShape(Flags.ExcludeOptional | Flags.IncludeTypes)} 
      ${where}
    `.LIMIT(limit).OFFSET(offset).build();

    const query = CONSTRUCT`
      ${this.getResourceSignature()}
      ${this.getShape(Flags.UnwrapOptional | Flags.IgnoreInverse)}
    `.WHERE`
      {
        ${selectSubQuery}
      }
      ${this.getShape(Flags.None)}
    `.build();

    return query;
  }

  getSearchQuery(where: SearchSchema, limit: number, offset: number) {
    const selectSubQuery = SELECT.DISTINCT`
      ${this.df.variable!("iri")}
    `.WHERE`
      ${this.getShape(Flags.ExcludeOptional | Flags.IncludeTypes, where)} 
    `.LIMIT(limit).OFFSET(offset).build();

    const query = CONSTRUCT`
      ${this.getResourceSignature()}
      ${this.getShape(Flags.UnwrapOptional | Flags.IgnoreInverse)}
    `.WHERE`
      {
        ${selectSubQuery}
      }
      ${this.getShape(Flags.None, where)}
    `.build();

    return query;
  }

  getByIrisQuery(iris: Iri[]) {
    const query = CONSTRUCT`
      ${this.getResourceSignature()}
      ${this.getShape(Flags.UnwrapOptional | Flags.IgnoreInverse)}
    `.WHERE`
      VALUES ?iri {
        ${iris.map(this.df.namedNode)}
      }
      ${this.getShape(Flags.IncludeTypes)}
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
    const helper = new UpdateHelper(this.schema, this.context);

    for (const entity of entities) {
      helper.process(entity);
    }

    return DELETE`${helper.deleteQuads}`.INSERT`${helper.insertQuads}`
      .WHERE`${helper.whereQuads}`.build();
  }
}
