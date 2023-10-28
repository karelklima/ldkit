import { BindingsFactory, N3, QuadFactory, type RDF, RDFJSON } from "../rdf.ts";
import {
  ArrayIterator,
  MappingIterator,
  TreeIterator,
} from "../asynciterator.ts";

type ResolveFormat = {
  "boolean": boolean;
  "bindings": RDF.ResultStream<RDF.Bindings>;
  "quads": RDF.ResultStream<RDF.Quad>;
};

export type ResolverType = keyof ResolveFormat;

abstract class QueryResolver<
  T extends ResolverType,
  O = Promise<ResolveFormat[T]>,
> {
  abstract resolve(response: Response): O;
}

class BooleanJsonResolver extends QueryResolver<"boolean"> {
  async resolve(response: Response) {
    const json = await response.json();
    if ("boolean" in json) {
      return Boolean(json.boolean);
    }
    throw new Error("Boolean SPARQL query result not found");
  }
}

class BindingsJsonResolver extends QueryResolver<"bindings"> {
  async resolve(response: Response) {
    const json = await response.json();

    if (!Array.isArray(json.results?.bindings)) {
      throw new Error("Bindings SPARQL query result not found");
    }

    const bindingsFactory = new BindingsFactory();

    const bindingsIterator = new ArrayIterator<RDFJSON.Bindings>(
      json.results!.bindings,
    );

    // TODO: review the unknown type cast
    return new MappingIterator(
      bindingsIterator,
      (i) => bindingsFactory.fromJson(i),
    ) as unknown as RDF.ResultStream<RDF.Bindings>;
  }
}

class QuadsJsonResolver extends QueryResolver<"quads"> {
  async resolve(response: Response) {
    const json = await response.json();

    if (!(json?.constructor === Object)) {
      throw new Error("Quads SPARQL query result not found");
    }

    const quadFactory = new QuadFactory();

    const treeIterator = new TreeIterator<RDFJSON.Term>(json);

    // TODO: review the unknown type cast
    return new MappingIterator(
      treeIterator,
      (i) => quadFactory.fromJson(i as [string, string, RDFJSON.Term]),
    ) as unknown as RDF.ResultStream<RDF.Quad>;
  }
}

class QuadsTurtleResolver extends QueryResolver<"quads"> {
  async resolve(response: Response) {
    const text = await response.text();

    const quads = new N3.Parser({ format: "turtle" }).parse(text);
    return new ArrayIterator(quads);
  }
}

type ResolversMap = {
  [K in ResolverType]: Record<string, QueryResolver<K>>;
};

const resolvers: ResolversMap = {
  "boolean": {
    "application/sparql-results+json": new BooleanJsonResolver(),
  },
  "bindings": {
    "application/sparql-results+json": new BindingsJsonResolver(),
  },
  "quads": {
    "application/rdf+json": new QuadsJsonResolver(),
    "text/turtle": new QuadsTurtleResolver(),
  },
};

export const getResponseTypes = (resolverType: ResolverType) =>
  Object.keys(resolvers[resolverType]);

export const resolve = <T extends ResolverType>(
  resolverType: T,
  response: Response,
) => {
  const contentType = response.headers.get("Content-type");
  if (!contentType) {
    throw new Error(`Content-type header was not found in response`);
  }
  const separatorPosition = contentType.indexOf(";");
  const mime = separatorPosition > 0
    ? contentType.substring(0, separatorPosition)
    : contentType;

  const resolver = resolvers[resolverType][mime];

  if (!resolver) {
    throw new Error(`No resolver exists for response type '${mime}'`);
  }

  return resolver.resolve(response);
};
