import {
  createResource,
  createNamespace,
  createDefaultContext,
} from "@ldkit/core";
import type { SchemaInterface } from "@ldkit/core";
import { dcterms, schema, xsd } from "@ldkit/namespaces";

import { Store } from "n3";

const time = createNamespace({
  iri: "http://www.w3.org/2006/time#",
  prefix: "time:",
  terms: ["Instant", "inXSDDate", "inXSDDateTimeStamp"],
} as const);

const desky = createNamespace({
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
} as const);

const sb504_2004 = createNamespace({
  iri: "https://slovník.gov.cz/legislativní/sbírka/500/2004/pojem/",
  prefix: "sb504_2004:",
  terms: ["vyvěšení-informace"],
} as const);

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
    "@context": InstantSchema,
    "@meta": ["@optional"],
  },
  validUntil: {
    "@id": desky["relevantní-do"],
    "@context": InstantSchema,
  },
} as const;

export const store = new Store();

createDefaultContext({
  sources: [
    {
      type: "file",
      value: "https://www.mesto-hranice.cz/export/uredni-deska",
    },
  ],
});

export type InformationInterface = SchemaInterface<typeof InformationSchema>;

// const x: TodoInterface = {} as unknown as TodoInterface;

export const Infos = createResource(InformationSchema);
