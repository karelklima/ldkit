import { xsd } from "../../namespaces/xsd.ts";
import { rdf } from "../../namespaces/rdf.ts";
import { ldkit } from "../../namespaces/ldkit.ts";
import { type IRI } from "../rdf.ts";

/** Map of supported RDF data types and their JavaScript native counterparts */
export type SupportedDataTypes = {
  [xsd.dateTime]: Date;
  [xsd.date]: Date;
  [xsd.gDay]: Date;
  [xsd.gMonthDay]: Date;
  [xsd.gYear]: Date;
  [xsd.gYearMonth]: Date;
  [xsd.boolean]: boolean;
  [xsd.double]: number;
  [xsd.decimal]: number;
  [xsd.float]: number;
  [xsd.integer]: number;
  [xsd.long]: number;
  [xsd.int]: number;
  [xsd.byte]: number;
  [xsd.short]: number;
  [xsd.negativeInteger]: number;
  [xsd.nonNegativeInteger]: number;
  [xsd.nonPositiveInteger]: number;
  [xsd.positiveInteger]: number;
  [xsd.unsignedByte]: number;
  [xsd.unsignedInt]: number;
  [xsd.unsignedLong]: number;
  [xsd.unsignedShort]: number;
  [xsd.string]: string;
  [xsd.normalizedString]: string;
  [xsd.anyURI]: string;
  [xsd.base64Binary]: string;
  [xsd.language]: string;
  [xsd.Name]: string;
  [xsd.NCName]: string;
  [xsd.NMTOKEN]: string;
  [xsd.token]: string;
  [xsd.hexBinary]: string;
  [rdf.langString]: string;
  [xsd.time]: string;
  [xsd.duration]: string;
  [ldkit.IRI]: IRI;
};

/** List of supported native JavaScript types */
export type SupportedNativeTypes = SupportedDataTypes[keyof SupportedDataTypes];
