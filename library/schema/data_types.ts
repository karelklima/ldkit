import xsd from "../namespaces/xsd.ts";
import rdf from "../namespaces/rdf.ts";

const SupportedDataTypesPrototype = {
  [xsd.dateTime]: new Date(),
  [xsd.date]: new Date(),
  [xsd.gDay]: new Date(),
  [xsd.gMonthDay]: new Date(),
  [xsd.gYear]: new Date(),
  [xsd.gYearMonth]: new Date(),
  [xsd.boolean]: true,
  [xsd.double]: 0.0,
  [xsd.decimal]: 0.0,
  [xsd.float]: 0.0,
  [xsd.integer]: 0,
  [xsd.long]: 0,
  [xsd.int]: 0,
  [xsd.byte]: 0,
  [xsd.short]: 0,
  [xsd.negativeInteger]: 0,
  [xsd.nonNegativeInteger]: 0,
  [xsd.nonPositiveInteger]: 0,
  [xsd.positiveInteger]: 0,
  [xsd.unsignedByte]: 0,
  [xsd.unsignedInt]: 0,
  [xsd.unsignedLong]: 0,
  [xsd.unsignedShort]: 0,
  [xsd.string]: "",
  [xsd.normalizedString]: "",
  [xsd.anyURI]: "",
  [xsd.base64Binary]: "",
  [xsd.language]: "",
  [xsd.Name]: "",
  [xsd.NCName]: "",
  [xsd.NMTOKEN]: "",
  [xsd.token]: "",
  [xsd.hexBinary]: "",
  [rdf.langString]: "",
};

export type SupportedDataTypes = typeof SupportedDataTypesPrototype;

export type SupportedNativeTypes = SupportedDataTypes[keyof SupportedDataTypes];
