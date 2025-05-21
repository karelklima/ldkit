import { assertEquals } from "../test_deps.ts";
import { SchemaSpec } from "../../scripts/schema_to_script.ts";
import { shexcToSchema } from "../../scripts/shex_to_schema.ts";
import { createNamespace, foaf, ldkit, schema, xsd } from "ldkit/namespaces";

const ex = createNamespace(
  {
    iri: "http://x/",
    prefix: "ex:",
    terms: [
      "state",
      "priority",
      "scale",
      "resolution",
      "AType",
      "BType",
      "CType",
      "DType",
      "aProperty",
      "bProperty",
      "cProperty",
      "dProperty",
    ],
  } as const,
);

const test = (shexc: string, schemas: SchemaSpec | SchemaSpec[]) => {
  schemas = Array.isArray(schemas) ? schemas : [schemas];

  const prefixedShexc = `
    PREFIX ex: <http://x/>
    PREFIX ${ldkit.$prefix} <${ldkit.$iri}>
    PREFIX ${xsd.$prefix} <${xsd.$iri}>
    PREFIX ${schema.$prefix} <${schema.$iri}>
    PREFIX ${foaf.$prefix} <${foaf.$iri}>

    ${shexc}
  `;
  const result = shexcToSchema(prefixedShexc);
  assertEquals(result, Array.isArray(schemas) ? schemas : [schemas]);
};

const testProperties = (
  shexc: string,
  properties: SchemaSpec["properties"],
) => {
  return test(shexc, {
    "name": "TheSchema",
    "type": [],
    properties,
  });
};

Deno.test("Scripts / Shex to Schema / Default schema name", () => {
  const input = `
    ex:ThingShape {
    }
  `;

  const schema = {
    name: "ThingShape",
    type: [],
    properties: {},
  };

  test(input, schema);
});

Deno.test("Scripts / Shex to Schema / Multiple schemas", () => {
  const input = `
    ex:ThingShape {
    }
    ex:ThingShape2 {
    }
    ex:ThingShape3 {
    }
  `;

  const schemas = [{
    name: "ThingShape",
    type: [],
    properties: {},
  }, {
    name: "ThingShape2",
    type: [],
    properties: {},
  }, {
    name: "ThingShape3",
    type: [],
    properties: {},
  }];

  test(input, schemas);
});

Deno.test("Scripts / Shex to Schema / Schema with type", () => {
  const input = `
    ex:AgentShape {
      a [foaf:Agent]
    }
    ex:PersonShape {
      a [foaf:Person];
      a [foaf:Agent];
    }
  `;

  const schema = [{
    name: "AgentShape",
    type: [foaf.Agent],
    properties: {},
  }, {
    name: "PersonShape",
    type: [foaf.Person, foaf.Agent],
    properties: {},
  }];

  test(input, schema);
});

Deno.test("Scripts / Shex to Schema / Property datatypes", () => {
  const input = `
    ex:PersonShape {
      foaf:firstName xsd:string;
      foaf:familyName xsd:string;
      foaf:age xsd:integer;
      foaf:birthday xsd:date;
      foaf:homepage IRI;
    }
  `;

  const schema = {
    name: "PersonShape",
    type: [],
    properties: {
      firstName: {
        id: foaf.firstName,
        type: xsd.string,
      },
      familyName: {
        id: foaf.familyName,
        type: xsd.string,
      },
      age: {
        id: foaf.age,
        type: xsd.integer,
      },
      birthday: {
        id: foaf.birthday,
        type: xsd.date,
      },
      homepage: {
        id: foaf.homepage,
        type: ldkit.IRI,
      },
    },
  };

  test(input, schema);
});

Deno.test("Scripts / Shex to Schema / Property flags", () => {
  const input = `
    ex:PersonShape {
      foaf:firstName xsd:string+;
      foaf:familyName xsd:string;
      foaf:age xsd:integer {0,1};
      foaf:birthday xsd:date {1};
      foaf:homepage IRI?;
      foaf:knows IRI*;
      foaf:interest IRI {3,5};
    }
  `;

  const schema = {
    name: "PersonShape",
    type: [],
    properties: {
      firstName: {
        id: foaf.firstName,
        type: xsd.string,
        array: true,
      },
      familyName: {
        id: foaf.familyName,
        type: xsd.string,
      },
      age: {
        id: foaf.age,
        type: xsd.integer,
        optional: true,
      },
      birthday: {
        id: foaf.birthday,
        type: xsd.date,
      },
      homepage: {
        id: foaf.homepage,
        type: ldkit.IRI,
        optional: true,
      },
      knows: {
        id: foaf.knows,
        type: ldkit.IRI,
        optional: true,
        array: true,
      },
      interest: {
        id: foaf.interest,
        type: ldkit.IRI,
        array: true,
      },
    },
  };

  test(input, schema);
});

Deno.test("Scripts / Shex to Schema / Inverse property", () => {
  const input = `
    ex:PersonShape {
      ^foaf:member IRI+
    }
  `;

  const schema = {
    name: "PersonShape",
    type: [],
    properties: {
      member: {
        id: foaf.member,
        type: ldkit.IRI,
        array: true,
        inverse: true,
      },
    },
  };

  test(input, schema);
});

Deno.test("Scripts / Shex to Schema / Property enumeration values", () => {
  const input = `
    ex:IssueShape {
      ex:state [ex:unassigned ex:assigned];
      ex:priority [0 1 2];
      ex:scale [0.5 1.0 1.5 2.0];
      ex:resolution ["fixed" "wontfix"];
    }
  `;

  const schema = {
    name: "IssueShape",
    type: [],
    properties: {
      state: {
        id: ex.state,
        type: ldkit.IRI,
      },
      priority: {
        id: ex.priority,
        type: xsd.integer,
      },
      scale: {
        id: ex.scale,
        type: xsd.decimal,
      },
      resolution: {
        id: ex.resolution,
      },
    },
  };

  test(input, schema);
});

Deno.test("Scripts / Shex to Schema / Expression reuse", () => {
  const input = `
    ex:UserShape {
      $ex:entity (
        foaf:name LITERAL ;
        foaf:mbox IRI+
      ) ;
      <userID> LITERAL
    }
    ex:EmployeeShape {
      &ex:entity ;
      <employeeID> LITERAL
    }
  `;

  const schemas: SchemaSpec[] = [{
    name: "UserShape",
    type: [],
    properties: {
      name: {
        id: foaf.name,
      },
      mbox: {
        id: foaf.mbox,
        type: ldkit.IRI,
        array: true,
      },
      userID: {
        id: "userID",
      },
    },
  }, {
    name: "EmployeeShape",
    type: [],
    properties: {
      name: {
        id: foaf.name,
      },
      mbox: {
        id: foaf.mbox,
        type: ldkit.IRI,
        array: true,
      },
      employeeID: {
        id: "employeeID",
      },
    },
  }];

  test(input, schemas);
});

Deno.test("Scripts / Shex to Schema / Expression with choices", () => {
  const input = `
    ex:UserShape {
      (                              
        foaf:name LITERAL;
      |
        foaf:knows @ex:AgentShape                        
      |                            
        foaf:givenName LITERAL+;
        foaf:familyName LITERAL
      );                             
      foaf:mbox IRI
    }
    ex:AgentShape {
      foaf:title LITERAL
    }
  `;

  const schemas: SchemaSpec[] = [{
    name: "UserShape",
    type: [],
    properties: {
      name: {
        id: foaf.name,
        optional: true,
      },
      knows: {
        id: foaf.knows,
        schemaRef: "AgentShape",
        optional: true,
      },
      givenName: {
        id: foaf.givenName,
        array: true,
        optional: true,
      },
      familyName: {
        id: foaf.familyName,
        optional: true,
      },
      mbox: {
        id: foaf.mbox,
        type: ldkit.IRI,
      },
    },
  }, {
    name: "AgentShape",
    type: [],
    properties: {
      title: {
        id: foaf.title,
      },
    },
  }];

  test(input, schemas);
});

Deno.test("Scripts / Shex to Schema / Nested explicit shapes", () => {
  const input = `
    ex:GroupShape {
      foaf:member @ex:PersonShape;
    }
    ex:PersonShape {
      foaf:made @ex:ThingShape;
    }
    ex:ThingShape {
    }
  `;

  const schemas: SchemaSpec[] = [{
    name: "GroupShape",
    type: [],
    properties: {
      member: {
        id: foaf.member,
        schemaRef: "PersonShape",
      },
    },
  }, {
    name: "PersonShape",
    type: [],
    properties: {
      made: {
        id: foaf.made,
        schemaRef: "ThingShape",
      },
    },
  }, {
    name: "ThingShape",
    type: [],
    properties: {},
  }];

  test(input, schemas);
});

Deno.test("Scripts / Shex to Schema / Nested implicit shapes", () => {
  const input = `
    ex:GroupShape {
      foaf:member {
        foaf:made {
          foaf:title LITERAL
        };
      }
    }
  `;

  const schemas: SchemaSpec[] = [{
    name: "GroupShape",
    type: [],
    properties: {
      member: {
        id: foaf.member,
        schema: {
          name: "AnonymousSchema",
          type: [],
          properties: {
            made: {
              id: foaf.made,
              schema: {
                name: "AnonymousSchema",
                type: [],
                properties: {
                  title: {
                    id: foaf.title,
                  },
                },
              },
            },
          },
        },
      },
    },
  }];

  test(input, schemas);
});

Deno.test("Scripts / Shex to Schema / Shape AND", () => {
  const input = `
    ex:TheShape {
      foaf:member (
        @ex:AShape
        AND
        (@ex:BShape AND @ex:CShape)
        AND
        { 
          a [ex:DType] ;
          ex:dProperty LITERAL
        }
      )
    }
    ex:AShape {
      a [ex:AType];
      ex:aProperty LITERAL
    }
    ex:BShape {
      a [ex:BType];
      ex:bProperty LITERAL
    }
    ex:CShape {
      a [ex:CType];
      ex:cProperty LITERAL
    }
  `;

  const schemas: SchemaSpec[] = [{
    name: "TheShape",
    type: [],
    properties: {
      member: {
        id: foaf.member,
        schema: {
          name: "AnonymousSchema",
          type: [ex.AType, ex.BType, ex.CType, ex.DType],
          properties: {
            aProperty: {
              id: ex.aProperty,
            },
            bProperty: {
              id: ex.bProperty,
            },
            cProperty: {
              id: ex.cProperty,
            },
            dProperty: {
              id: ex.dProperty,
            },
          },
        },
      },
    },
  }, {
    name: "AShape",
    type: [ex.AType],
    properties: {
      aProperty: {
        id: ex.aProperty,
      },
    },
  }, {
    name: "BShape",
    type: [ex.BType],
    properties: {
      bProperty: {
        id: ex.bProperty,
      },
    },
  }, {
    name: "CShape",
    type: [ex.CType],
    properties: {
      cProperty: {
        id: ex.cProperty,
      },
    },
  }];

  test(input, schemas);
});

Deno.test("Scripts / Shex to Schema / Shape OR", () => {
  const input = `
    ex:TheShape {
      foaf:member (
        @ex:AShape
        OR
        (@ex:BShape OR @ex:CShape)
        OR
        { 
          a [ex:DType] ;
          ex:dProperty LITERAL
        }
      )
    }
    ex:AShape {
      a [ex:AType];
      ex:aProperty LITERAL
    }
    ex:BShape {
      a [ex:BType];
      ex:bProperty LITERAL
    }
    ex:CShape {
      a [ex:CType];
      ex:cProperty LITERAL
    }
  `;

  const schemas: SchemaSpec[] = [{
    name: "TheShape",
    type: [],
    properties: {
      member: {
        id: foaf.member,
        schema: {
          name: "AnonymousSchema",
          type: [],
          properties: {
            aProperty: {
              id: ex.aProperty,
              optional: true,
            },
            bProperty: {
              id: ex.bProperty,
              optional: true,
            },
            cProperty: {
              id: ex.cProperty,
              optional: true,
            },
            dProperty: {
              id: ex.dProperty,
              optional: true,
            },
          },
        },
      },
    },
  }, {
    name: "AShape",
    type: [ex.AType],
    properties: {
      aProperty: {
        id: ex.aProperty,
      },
    },
  }, {
    name: "BShape",
    type: [ex.BType],
    properties: {
      bProperty: {
        id: ex.bProperty,
      },
    },
  }, {
    name: "CShape",
    type: [ex.CType],
    properties: {
      cProperty: {
        id: ex.cProperty,
      },
    },
  }];

  test(input, schemas);
});
