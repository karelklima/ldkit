import { Schema, expandSchema, getSchemaProperties } from "@ldkit/schema";
import type { SchemaInterface } from "@ldkit/schema";
import { schema, xsd } from "@ldkit/namespaces";

const User = {
  "@type": schema.Person,
  firstName: schema.givenName,
  lastName: {
    "@id": schema.familyName,
    "@meta": ["@optional"],
  },
  email: schema.email,
} as const;

const UserSchema: Schema = {
  "@type": [schema.Person],
  firstName: {
    "@id": schema.givenName,
    "@type": xsd.string,
    "@meta": [],
  },
  lastName: {
    "@id": schema.familyName,
    "@type": xsd.string,
    "@meta": ["@optional"],
  },
  email: {
    "@id": schema.email,
    "@type": xsd.string,
    "@meta": [],
  },
};

describe("schema/interface", () => {
  test("accepts schema prototype as schema interface creates schema interface from schema prototype", () => {
    const s = expandSchema(User);
    type UserInterface = SchemaInterface<typeof User>;
    const u: UserInterface = {} as unknown as UserInterface;

    expect(s).toEqual(UserSchema);
  });

  test("getSchemaProperties", () => {
    const properties = getSchemaProperties(UserSchema);
    const { firstName, lastName, email } = UserSchema;
    const targetProperties = { firstName, lastName, email };
    expect(properties).toEqual(targetProperties);
  });
});
