import { createNamespace } from "./namespace";

export default createNamespace({
  iri: "http://www.w3.org/2000/01/rdf-schema#",
  prefix: "rdfs:",
  terms: [
    "Class",
    "Container",
    "ContainerMembershipProperty",
    "Datatype",
    "Literal",
    "Resource",
    "comment",
    "domain",
    "isDefinedBy",
    "label",
    "member",
    "range",
    "seeAlso",
    "subClassOf",
    "subPropertyOf",
  ],
} as const);
