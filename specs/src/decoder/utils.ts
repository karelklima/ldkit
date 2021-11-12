import { Parser } from "n3";
import type { Quad } from "@ldkit/rdf";
import { quadsToGraph } from "@ldkit/rdf";
import { ldkit, xsd } from "@ldkit/namespaces";

const parser = new Parser();

const X_NAMESPACE = "http://x/";

export const createGraph = (turtle: string) => {
  const prefixedTurtle = `
  @prefix x: <${X_NAMESPACE}> .
  @prefix ${ldkit.$prefix} <${ldkit.$iri}> .
  @prefix ${xsd.$prefix} <${xsd.$iri}> .

  ${turtle}`;
  const quads = parser.parse(prefixedTurtle);
  return quadsToGraph(quads);
};

export const x = (s: string) => `${X_NAMESPACE}${s}`;
