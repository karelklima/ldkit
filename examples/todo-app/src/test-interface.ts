import { dcterms, schema } from "@ldkit/namespaces";

type Meta = "@optional" | "@array" | "@lazy";

export type PropertyPrototype = {
  "@id": string;
  "@type"?: string;
  "@meta"?: Meta | readonly Meta[];
  "@context"?: SchemaPrototype;
};

export type SchemaPrototypeProperties = {
  [key: string]: PropertyPrototype | string | readonly string[];
};

export type SchemaPrototypeType = {
  "@type": string | readonly string[];
};

export type SchemaPrototype = SchemaPrototypeProperties & SchemaPrototypeType;

export type Property = {
  "@id": string;
  "@type"?: string;
  "@meta": Meta[];
  "@context"?: Schema;
};

export type Schema = {
  [key: string]: Property | string[];
  "@type": string[];
};

const createSchema = <S extends SchemaPrototype>(p: S) => p;

const DctermsBase = {
  title: dcterms.title,
};

let User = createSchema({
  ...DctermsBase,
  "@type": [schema.Person, schema.Thing],
  firstName: "https://schema.org/familyName",
  lastName: {
    "@id": schema.familyName,
    "@meta": ["@optional", "@lazy"],
  },
  email: schema.email,
} as const);

type x = typeof User;

const g = 100;
type h = typeof g;

type NamespacePrototype = {
  iri: string;
  prefix: string;
  terms: readonly string[];
};

type NamespacePrefix<Namespace extends NamespacePrototype> =
  Namespace["prefix"];

type NamespaceObject<Namespace extends NamespacePrototype> = {
  [Term in Namespace["terms"][number]]: `${NamespacePrefix<Namespace>}${Term}`;
};

/* export const createNamespace = <
  N extends NamespacePrototype,
  // I = NamespaceItems<N>,
  // P = NamespacePrefix<N>,
  O = NamespaceObject<N>
>(
  namespaceSpec: N
): O =>
  Object.assign(
    //<X extends I>(f: [X]) =>
    //  `${namespaceSpec.prefix}:${f}` as `${string & P}${string & X}`,
    namespaceSpec.terms.reduce((acc, term) => {
      //acc[term] = `${namespaceSpec.prefix}${term}`
      acc[term] = `${namespaceSpec.iri}${term}`;
      return acc;
    }, {} as any),
    { $$namespace: namespaceSpec }
  ) as O; */

export const createNamespace = <
  N extends any
  // I = NamespaceItems<N>,
  // P = NamespacePrefix<N>,
  // O = NamespaceObject<N>
>(
  namespaceSpec: N
) => namespaceSpec;

const pp = createNamespace({
  iri: "https://slovník.gov.cz/datový/pracovní-prostor/pojem/",
  prefix: "d-sgov-pracovní-prostor-pojem:",
  terms: [
    "metadatový-kontext",
    "slovníkový-kontext",
    "odkazuje-na-kontext",
    "vychází-z-verze",
    "používá-pojmy-ze-slovníku",
  ],
} as const);

type xx = typeof pp;
