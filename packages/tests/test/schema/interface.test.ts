import { $ID, $META, $OPTIONAL, $TYPE } from "@ldkit/keys";
import { Schema, expandSchema, getSchemaProperties } from "@ldkit/schema";
import { schema, xsd } from "@ldkit/namespaces";

const User = {
  [$TYPE]: schema.Person,
  firstName: schema.givenName,
  lastName: {
    [$ID]: schema.familyName,
    [$META]: [$OPTIONAL],
  },
  email: schema.email,
} as const;

const UserSchema: Schema = {
  [$TYPE]: [schema.Person],
  firstName: {
    [$ID]: schema.givenName,
    [$TYPE]: xsd.string,
    [$META]: [],
  },
  lastName: {
    [$ID]: schema.familyName,
    [$TYPE]: xsd.string,
    [$META]: [$OPTIONAL],
  },
  email: {
    [$ID]: schema.email,
    [$TYPE]: xsd.string,
    [$META]: [],
  },
};

describe("schema/interface", () => {
  test("accepts schema prototype as schema interface creates schema interface from schema prototype", () => {
    const s = expandSchema(User);
    expect(s).toEqual(UserSchema);
  });

  test("getSchemaProperties", () => {
    const properties = getSchemaProperties(UserSchema);
    const { firstName, lastName, email } = UserSchema;
    const targetProperties = { firstName, lastName, email };
    expect(properties).toEqual(targetProperties);
  });
});
