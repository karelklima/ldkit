import { DefaultGraph, type RDF } from "../rdf.ts";
import { xsd } from "../namespaces/xsd.ts";
import { escape } from "./escape.ts";

export const blankNode = (term: RDF.BlankNode) => {
  return `_:${term.value}`;
};

export const namedNode = (term: RDF.NamedNode) => {
  return `<${term.value}>`;
};

export const variable = (term: RDF.Variable) => {
  return `?${term.value}`;
};

export const literal = (term: RDF.Literal) => {
  const datatype = term.datatype.value;
  if (datatype === xsd.boolean) {
    return term.value == "true" || term.value == "1" ? "true" : "false";
  }

  const value = `"${escape(term.value)}"`;

  if (term.language) {
    return `${value}@${term.language}`;
  }

  if (datatype !== xsd.string) {
    return `${value}^^${namedNode(term.datatype)}`;
  }

  return value;
};

const quad = (term: RDF.BaseQuad) => {
  const triple = `${stringify(term.subject)} ${stringify(term.predicate)} ${
    stringify(term.object)
  } .`;

  if (term.graph.equals(DefaultGraph.INSTANCE)) {
    return triple;
  }

  return `GRAPH ${stringify(term.graph)} { ${triple} }`;
};

export const stringify = (term: RDF.Term): string => {
  switch (term.termType) {
    case "BlankNode":
      return blankNode(term);
    case "NamedNode":
      return namedNode(term);
    case "Variable":
      return variable(term);
    case "Literal":
      return literal(term);
    case "Quad":
      return quad(term);
    default:
      throw new Error("Unknown RDF type found.");
  }
};
