import {
  type Context,
  createLens,
  createNamespace,
  type SchemaInterface,
} from "ldkit";
import { dcterms, schema, xsd } from "ldkit/namespaces";
import { QueryEngine as Comunica } from "@comunica/query-sparql";

const time = createNamespace(
  {
    iri: "http://www.w3.org/2006/time#",
    prefix: "time:",
    terms: ["Instant", "inXSDDate", "inXSDDateTimeStamp"],
  } as const,
);

const desky = createNamespace(
  {
    iri: "https://slovník.gov.cz/datový/ofn-úřední-desky/pojem/",
    prefix: "desky:",
    terms: [
      "úřední-deska",
      "stránka-zveřejnění",
      "informace-zveřejněná-na-úřední-desce",
      "vyvěšení-informace",
      "schválení-informace",
      "relevantní-do",
      "číslo-jednací",
      "spisová-značka-spisu",
    ],
  } as const,
);

const sb504_2004 = createNamespace(
  {
    iri: "https://slovník.gov.cz/legislativní/sbírka/500/2004/pojem/",
    prefix: "sb504_2004:",
    terms: ["vyvěšení-informace"],
  } as const,
);

const InstantSchema = {
  "@type": time.Instant,
  date: {
    "@id": time.inXSDDate,
    "@type": xsd.date,
  },
} as const;

const BoardSchema = {
  "@type": desky["úřední-deska"],
  [desky["stránka-zveřejnění"]]: "@id",
} as const;

const InformationSchema = {
  "@type": desky["informace-zveřejněná-na-úřední-desce"],
  url: schema.downloadUrl,
  title: dcterms.title,
  published: {
    "@id": sb504_2004["vyvěšení-informace"],
    "@schema": InstantSchema,
    "@optional": true,
  },
  validUntil: {
    "@id": desky["relevantní-do"],
    "@schema": InstantSchema,
  },
} as const;

export const DEFAULT_BOARD_IRI =
  "https://ofn.gov.cz/úřední-desky/2021-07-20/příklady/3.jsonld";

export type InformationInterface = SchemaInterface<typeof InformationSchema>;

const engine = new Comunica();

export const createInfosResource = (iri: string) => {
  const context: Context = {
    sources: [{
      type: "file",
      value: iri,
    }],
  };
  return createLens(InformationSchema, context, engine);
};
