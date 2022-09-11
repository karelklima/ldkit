import { BindingsFactory } from "https://esm.sh/@comunica/bindings-factory@2.2.0";
import { DataFactory, RDF, type RDFJSON } from "../rdf.ts";

export type BindingsRecordType = Record<string, RDF.Term>;

type JsonTerm = {
  type: "uri" | "literal" | "bnode";
  value: string;
  "xml:lang"?: string;
  datatype?: string;
};
type JsonBindings = Record<string, JsonTerm>;

const jsonToTerm = (jsonTerm: RDFJSON.Term, dataFactory: DataFactory) => {
  if (jsonTerm.type === "uri") {
    return dataFactory.namedNode(jsonTerm.value);
  }
  if (jsonTerm.type === "bnode") {
    return dataFactory.blankNode(jsonTerm.value);
  }
  if ("xml:lang" in jsonTerm) {
    return dataFactory.literal(jsonTerm.value, jsonTerm["xml:lang"]);
  }
  if ("datatype" in jsonTerm) {
    return dataFactory.literal(
      jsonTerm.value,
      dataFactory.namedNode(jsonTerm.datatype!),
    );
  }
  return dataFactory.literal(jsonTerm.value);
};

export const jsonToBindingsFactory = () => {
  const dataFactory = new DataFactory();
  const bindingsFactory = new BindingsFactory(dataFactory);
  return (jsonBindings: RDFJSON.Bindings) => {
    // Remap JSON Sparql query result entry to [Variable, Term][]
    const bindingsEntries = Object.entries(jsonBindings).map((
      [varName, jsonTerm],
    ) => {
      return [
        dataFactory.variable(varName),
        jsonToTerm(jsonTerm, dataFactory),
      ] as [RDF.Variable, RDF.Term];
    });

    return bindingsFactory.bindings(bindingsEntries);
  };
};

export const jsonToQuadsFactory = () => {
  const jsonToBindings = jsonToBindingsFactory();
  const dataFactory = new DataFactory();
  return (jsonBindings: RDFJSON.Bindings) => {
    const bindings = jsonToBindings(jsonBindings);
    return dataFactory.quad(
      bindings.get("s") as RDF.Quad_Subject,
      bindings.get("p") as RDF.Quad_Predicate,
      bindings.get("o") as RDF.Quad_Object,
    );
  };
};
