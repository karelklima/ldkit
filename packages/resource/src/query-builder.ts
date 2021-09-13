import type { Iri } from "./iri";
import type { Schema } from "@ldkit/schema";
import {
  getSchemaProperties,
  $CONTEXT,
  $ID,
  $META,
  $OPTIONAL,
  $TYPE,
} from "@ldkit/schema";
import { $, CONSTRUCT, SELECT } from "@ldkit/sparql";
import { Quad, variable, namedNode, quad } from "@ldkit/rdf";

export const getObjectByIriQuery = (iri: Iri, schema: Schema) => {
  const properties = getSchemaProperties(schema);
  const variables = Object.keys(properties);

  const conditions = variables.map((v) =>
    quad(namedNode(iri), namedNode(properties[v][$ID]), variable(v))
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
    const rdfType = s[$TYPE];
    const properties = getSchemaProperties(s);

    rdfType.forEach((type) => {
      conditions.push($`${variable(varPrefix)} a ${namedNode(type)} .`);
    });

    Object.keys(properties).forEach((prop, index) => {
      const property = properties[prop];
      if (wrapOptional && property[$META].includes($OPTIONAL)) {
        conditions.push($`\nOPTIONAL {`);
      }
      conditions.push(
        quad(
          variable(varPrefix),
          namedNode(property[$ID]),
          variable(`${varPrefix}_${index}`)
        )
      );
      if (typeof property[$CONTEXT] === "object") {
        console.error("Populating", property[$CONTEXT]);
        populateConditionsRecursive(
          property[$CONTEXT] as Schema,
          `${varPrefix}_${index}`
        );
      }
      if (wrapOptional && property[$META].includes($OPTIONAL)) {
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
  schema[$TYPE].forEach((type) => {
    conditions.push($`${variable("iri")} a ${namedNode(type)} .`);
  });

  const query = SELECT`${variable("iri")}`.WHERE`${conditions}`.build();

  return query;
};

const getPartialSelectQuery = (schema: Schema, offset = 0, limit = 1000) => {
  const conditions = new Array<Quad | ReturnType<typeof $>>();
  schema[$TYPE].forEach((type) => {
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
