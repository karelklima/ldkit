import { DataFactory, fromRdf, RDF, toRdf } from "./rdf.ts";
import { SupportedDataTypes } from "./schema/mod.ts";

const df = new DataFactory();

const rdfToNativeHandlers = new Map<
  keyof SupportedDataTypes,
  (literalValue: string) => unknown
>();
const nativeToRdfHandlers = new Map<
  keyof SupportedDataTypes,
  (nativeValue: unknown) => string
>();

/**
 * Registers a data type handler for translating between RDF literals and JavaScript values.
 *
 * In order to register a custom data type handler, the custom data type TypeScript mapping needs
 * to be added to the `CustomDataTypes` interface using module augmentation.
 *
 * @param dataType - The data type to register.
 * @param translateFromRDF - Function to translate from RDF literal to JavaScript value.
 * @param translateToRDF - Function to translate from JavaScript value to RDF literal.
 */
export function registerDataHandler<T extends keyof SupportedDataTypes>(
  dataType: T,
  translateFromRDF: (literalValue: string) => SupportedDataTypes[T],
  translateToRDF: (nativeValue: SupportedDataTypes[T]) => string,
): void {
  rdfToNativeHandlers.set(dataType, translateFromRDF);
  nativeToRdfHandlers.set(
    dataType,
    translateToRDF as (nativeValue: unknown) => string,
  );
}

export function translateFromRdf(literal: RDF.Literal) {
  const dataType = literal.datatype.value as keyof SupportedDataTypes;
  const customHandler = rdfToNativeHandlers.get(dataType);
  if (customHandler) {
    return customHandler(literal.value);
  } else {
    return fromRdf(literal);
  }
}

export function translateToRdf(
  value: unknown,
  dataType: keyof SupportedDataTypes | string,
) {
  const customHandler = nativeToRdfHandlers.get(
    dataType as keyof SupportedDataTypes,
  );
  if (customHandler) {
    return df.literal(customHandler(value), df.namedNode(dataType));
  } else {
    return toRdf(value, {
      datatype: df.namedNode(dataType),
    });
  }
}
