import type { Iri } from "./iri";
import type {
  Property,
  Schema,
  SchemaInterfaceIdentity,
  SchemaInterfaceType,
} from "@ldkit/schema";
import { getSchemaProperties } from "@ldkit/schema";
import { $, CONSTRUCT, SELECT } from "@ldkit/sparql";
import { Quad, variable, namedNode, quad, toRdf } from "@ldkit/rdf";
import { rdf, xsd } from "@ldkit/namespaces";

type Entity = SchemaInterfaceIdentity &
  Partial<SchemaInterfaceType> &
  Record<string, any>;

export class QueryBuilder {
  private readonly schema: Schema;
  private readonly schemaProperties: Record<string, Property>;

  constructor(schema: Schema) {
    this.schema = schema;
    this.schemaProperties = getSchemaProperties(this.schema);
  }

  getProperty(key: string) {
    return this.schemaProperties[key];
  }

  convertProperty(value: any, property: Property) {
    return toRdf(value, {
      datatype: namedNode(property["@type"] || xsd.string),
    });
  }

  entityToRdf(entity: Entity) {
    const { "@id": iri, "@type": extraTypes, ...properties } = entity;
    const result = new Array<Quad>();
    const types = [...this.schema["@type"], ...(extraTypes || [])];
    types.forEach((type) => {
      result.push(quad(namedNode(iri), namedNode(rdf.type), namedNode(type)));
    });
    return Object.keys(properties).reduce((acc, key) => {
      const value = properties[key];
      const property = this.schema[key] as Property;
      const rdfValue = this.convertProperty(value, property);
      acc.push(quad(namedNode(iri), namedNode(property["@id"]), rdfValue));
      return acc;
    }, result);
  }

  insertQuery(entity: Entity) {
    const quads = this.entityToRdf(entity);
    return this.insertDataQuery(quads);
  }

  insertDataQuery(quads: Quad[]) {
    const query = $`INSERT DATA { ${quads} }`.toString();
    return query;
  }

  updateQuery(
    entity: SchemaInterfaceIdentity &
      Partial<SchemaInterfaceType> &
      Partial<Record<string, any>>
  ) {
    const deleteQuads = new Array<Quad>();
    const updateQuads = new Array<Quad>();

    const { "@id": iri, "@type": types, ...relations } = entity;

    Object.keys(relations).forEach((key, index) => {
      const property = this.getProperty(key);
      if (property["@meta"].includes("@array")) {
        throw "Array properties are not supported for update";
      }
      const predicate = this.getProperty(key)["@id"];
      const rdfValue = this.convertProperty(relations[key], property);
      deleteQuads.push(
        quad(namedNode(iri), namedNode(predicate), variable(`v${index}`))
      );
      updateQuads.push(quad(namedNode(iri), namedNode(predicate), rdfValue));
    });

    const query = $`DELETE { 
        ${deleteQuads} }
      INSERT { 
        ${updateQuads} }
      WHERE { 
        ${deleteQuads} }`;
    return query.toString();
  }
}

export const getObjectByIriQuery = (iri: Iri, schema: Schema) => {
  const properties = getSchemaProperties(schema);
  const variables = Object.keys(properties);

  const conditions = variables.map((v) =>
    quad(namedNode(iri), namedNode(properties[v]["@id"]), variable(v))
  );

  const query = CONSTRUCT`${conditions}`.WHERE`${conditions}`.build();

  return query;
};

const getConditionsFromSchema = (
  schema: Schema,
  mainVar = "iri",
  wrapOptional = true
) => {
  const conditions = new Array<Quad | ReturnType<typeof $>>();

  const populateConditionsRecursive = (s: Schema, varPrefix: string) => {
    const rdfType = s["@type"];
    const properties = getSchemaProperties(s);

    rdfType.forEach((type) => {
      conditions.push($`${variable(varPrefix)} a ${namedNode(type)} .`);
    });

    Object.keys(properties).forEach((prop, index) => {
      const property = properties[prop];
      if (wrapOptional && property["@meta"].includes("@optional")) {
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
        console.error("Populating", property["@context"]);
        populateConditionsRecursive(
          property["@context"] as Schema,
          `${varPrefix}_${index}`
        );
      }
      if (wrapOptional && property["@meta"].includes("@optional")) {
        conditions.push($`\n}\n`);
      }
    });
  };

  populateConditionsRecursive(schema, mainVar);
  return conditions;
};

export const getObjectByIrisQuery = (iris: Iri[], schema: Schema) => {
  const query = CONSTRUCT`${getConditionsFromSchema(schema, "iri", false)}`
    .WHERE`${getConditionsFromSchema(
    schema,
    "iri",
    true
  )} VALUES ?iri { ${iris.map(namedNode)} }`.build();

  console.log(query);

  return query;
};

export const findIrisQuery = (schema: Schema) => {
  const conditions = new Array<Quad | ReturnType<typeof $>>();
  schema["@type"].forEach((type) => {
    conditions.push($`${variable("iri")} a ${namedNode(type)} .`);
  });

  const query = SELECT`${variable("iri")}`.WHERE`${conditions}`.build();

  return query;
};

const getPartialSelectQuery = (schema: Schema, offset = 0, limit = 1000) => {
  const conditions = new Array<Quad | ReturnType<typeof $>>();
  schema["@type"].forEach((type) => {
    conditions.push($`${variable("res")} a ${namedNode(type)} .`);
  });

  return SELECT`${variable("res")}`.WHERE`${conditions}`
    .OFFSET(offset)
    .LIMIT(limit)
    .build();
};

/* const getPartialBindQuery = (iris: Iri[]) => {
  return $`VALUES ?res { ${iris.map(namedNode)} }`
} */

export const findQuery = (schema: Schema) => {
  const query = CONSTRUCT`${getConditionsFromSchema(schema, "res", false)}`
    .WHERE`{ ${getPartialSelectQuery(schema)} }
    ${getConditionsFromSchema(schema, "res", true)}`.build();
  return query;
};

export const insertQuery = (quads: Quad[]) => {
  const query = $`INSERT DATA { ${quads} }`.toString();
  return query;
};

export const deleteQuery = (iri: Iri) => {
  return $`DELETE { ${namedNode(iri)} ?p ?o } WHERE { ${namedNode(
    iri
  )} ?p ?o}`.toString();
};
