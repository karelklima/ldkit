import type { Graph, IRI, RDF } from "../rdf.ts";
import {
  type Options,
  resolveOptions,
  resolveQueryContext,
} from "../options.ts";
import {
  type ExpandedSchema,
  expandSchema,
  type Identity,
  type Schema,
  type SchemaInterface,
  type SchemaSearchInterface,
  type SchemaUpdateInterface,
} from "../schema/mod.ts";
import { decode } from "../decoder.ts";

import { QueryBuilder } from "./query_builder.ts";
import type { Entity, Unite } from "./types.ts";
import { QueryEngineProxy } from "../engine/query_engine_proxy.ts";

/**
 * Creates an instance of Lens that lets you query and update RDF data
 * via data schema using TypeScript native data types.
 *
 * In order to create a Lens instance, you need to provide a data schema
 * that describes the data model which serves to translate data between
 * Linked Data and TypeScript native types (see {@link Schema} for details).
 *
 * You can also pass a set of options for LDkit and a query engine that
 * specify the data source, preferred language, etc. (see {@link Options} for details).
 *
 * @example
 * ```typescript
 * import { createLens, type Options } from "ldkit";
 * import { dbo, rdfs, xsd } from "ldkit/namespaces";
 *
 * // Create options for query engine
 * const options: Options = {
 *   sources: ["https://dbpedia.org/sparql"], // SPARQL endpoint
 *   language: "en", // Preferred language
 * };
 *
 * // Create a schema
 * const PersonSchema = {
 *   "@type": dbo.Person,
 *   name: rdfs.label,
 *   abstract: dbo.abstract,
 *   birthDate: {
 *     "@id": dbo.birthDate,
 *     "@type": xsd.date,
 *   },
 * } as const;
 *
 * // Create a resource using the data schema and options above
 * const Persons = createLens(PersonSchema, options);
 *
 * // List some persons
 * const persons = await Persons.find({ take: 10 });
 * for (const person of persons) {
 *   console.log(person.name); // string
 *   console.log(person.birthDate); // Date
 * }
 *
 * // Get a particular person identified by IRI
 * const ada = await Persons.findByIri("http://dbpedia.org/resource/Ada_Lovelace");
 * console.log(ada?.name); // string "Ada Lovelace"
 * console.log(ada?.birthDate); // Date object of 1815-12-10
 * ```
 *
 * @param schema data schema which extends {@link Schema}
 * @param options optional {@link Options} - contains LDkit and query engine configuration
 * @returns Lens instance that provides interface to Linked Data based on the schema
 */
export function createLens<T extends Schema>(
  schema: T,
  options?: Options,
): Lens<T> {
  return new Lens(schema, options);
}

/**
 * Lens provides an interface to Linked Data based on the data schema.
 *
 * For the best developer experience, use the {@link createLens} function to create the instance.
 */
export class Lens<T extends Schema> {
  private readonly schema: ExpandedSchema;
  private readonly options: Options;
  private readonly engine: QueryEngineProxy;
  private readonly queryBuilder: QueryBuilder;

  constructor(schema: T, options?: Options) {
    this.schema = expandSchema(schema);
    this.options = resolveOptions(options);
    const context = resolveQueryContext(this.options);
    this.engine = new QueryEngineProxy(this.options.engine!, context);
    this.queryBuilder = new QueryBuilder(this.schema, this.options);
  }

  private decode(graph: Graph) {
    return decode(graph, this.schema, this.options) as unknown as Unite<
      SchemaInterface<T>
    >[];
  }

  private log(query: string) {
    this.options.logQuery!(query);
  }

  /**
   * Returns the total number of entities corresponding to the data schema.
   *
   * @example
   * ```typescript
   * import { createLens } from "ldkit";
   * import { schema } from "ldkit/namespaces";
   *
   * // Create a schema
   * const PersonSchema = {
   *   "@type": schema.Person,
   *   name: schema.name,
   * } as const;
   *
   * // Create a resource using the data schema above
   * const Persons = createLens(PersonSchema);
   *
   * // Count all persons
   * const count = await Persons.count(); // number
   * ```
   *
   * @returns total number of entities corresponding to the data schema
   */
  async count(): Promise<number> {
    const q = this.queryBuilder.countQuery();
    this.log(q);
    const bindings = await this.engine.queryBindings(q);
    return parseInt(bindings[0].get("count")!.value);
  }

  /**
   * Find entities with a custom SPARQL query.
   *
   * The query must be a CONSTRUCT query, and the root nodes must be of type `ldkit:Resource`.
   * So that the decoder can decode the results, the query must also return all properties
   * according to the data schema.
   *
   * @example
   * ```typescript
   * import { createLens } from "ldkit";
   * import { ldkit, schema } from "ldkit/namespaces";
   * import { CONSTRUCT } from "ldkit/sparql";
   *
   * // Create a schema
   * const PersonSchema = {
   *   "@type": schema.Person,
   *   name: schema.name,
   * } as const;
   *
   * // Create a resource using the data schema above
   * const Persons = createLens(PersonSchema);
   *
   * // Query to find all persons named "Doe"
   * const query = CONSTRUCT`?s a <${ldkit.Resource}>; <${schema.name}> ?name`
   *   .WHERE`?s <${schema.name}> ?name; <${schema.familyName}> "Doe"`.build();
   *
   * // Find all persons that match the custom query
   * const doePersons = await Persons.query(query);
   * ```
   *
   * @param sparqlConstructQuery CONSTRUCT SPARQL query
   * @returns Found entities
   */
  async query(
    sparqlConstructQuery: string,
  ): Promise<Unite<SchemaInterface<T>>[]> {
    this.log(sparqlConstructQuery);
    const graph = await this.engine.queryGraph(sparqlConstructQuery);
    return this.decode(graph);
  }

  /**
   * Find entities that match the given search criteria.
   *
   * The search criteria is a JSON object that may contain properties from the data schema.
   * In addition you can specify how many results to return and how many to skip
   * for pagination purposes.
   *
   * @example
   * ```typescript
   * import { createLens } from "ldkit";
   * import { schema } from "ldkit/namespaces";
   *
   * // Create a schema
   * const PersonSchema = {
   *   "@type": schema.Person,
   *   name: schema.name,
   * } as const;
   *
   * // Create a resource using the data schema above
   * const Persons = createLens(PersonSchema);
   *
   * // Find 100 persons with name that starts with "Ada"
   * const persons = await Persons.find({
   *   where: {
   *     name: { $strStarts: "Ada" },
   *   },
   *   take: 100,
   * });
   * ```
   *
   * @param options Search criteria and pagination options
   * @returns entities that match the given search criteria
   */
  async find(
    options: {
      where?: SchemaSearchInterface<T> | string | RDF.Quad[];
      take?: number;
      skip?: number;
    } = {},
  ): Promise<Unite<SchemaInterface<T>>[]> {
    const { where, take, skip } = {
      take: this.options.take!,
      skip: 0,
      ...options,
    };
    const isRegularQuery = typeof where === "string" ||
      typeof where === "undefined" || Array.isArray(where);

    const q = isRegularQuery
      ? this.queryBuilder.getQuery(where, take, skip)
      : this.queryBuilder.getSearchQuery(where ?? {}, take, skip);
    this.log(q);
    const graph = await this.engine.queryGraph(q);
    return this.decode(graph);
  }

  /**
   * Find one entity that matches the given search criteria.
   *
   * The search criteria is a JSON object that may contain properties from the data schema.
   *
   * @example
   * ```typescript
   * import { createLens } from "ldkit";
   * import { schema } from "ldkit/namespaces";
   *
   * // Create a schema
   * const PersonSchema = {
   *   "@type": schema.Person,
   *   name: schema.name,
   * } as const;
   *
   * // Create a resource using the data schema above
   * const Persons = createLens(PersonSchema);
   *
   * // Find one person with name that starts with "Ada"
   * const person = await Persons.findOne({
   *   name: { $strStarts: "Ada" },
   * });
   * ```
   *
   * @param options Search criteria and pagination options
   * @returns entities that match the given search criteria
   */
  async findOne(where?: SchemaSearchInterface<T>) {
    const results = await this.find({ where, take: 1 });
    return results.length > 0 ? results[0] : null;
  }

  /**
   * Find a single entity that matches the given IRI.
   *
   * @example
   * ```typescript
   * import { createLens } from "ldkit";
   * import { schema } from "ldkit/namespaces";
   *
   * // Create a schema
   * const PersonSchema = {
   *   "@type": schema.Person,
   *   name: schema.name,
   * } as const;
   *
   * // Create a resource using the data schema above
   * const Persons = createLens(PersonSchema);
   *
   * // Get a particular person identified by IRI
   * const ada = await Persons.findByIri("http://dbpedia.org/resource/Ada_Lovelace");
   * console.log(ada?.name); // string "Ada Lovelace"
   * ```
   *
   * @param iri IRI of the entity to find
   * @returns Entity if found, null otherwise
   */
  async findByIri(iri: IRI): Promise<Unite<SchemaInterface<T>> | null> {
    const results = await this.findByIris([iri]);
    return results.length > 0 ? results[0] : null;
  }

  /**
   * Find entities that match the given IRIs.
   *
   * @example
   * ```typescript
   * import { createLens } from "ldkit";
   * import { schema } from "ldkit/namespaces";
   *
   * // Create a schema
   * const PersonSchema = {
   *   "@type": schema.Person,
   *   name: schema.name,
   * } as const;
   *
   * // Create a resource using the data schema above
   * const Persons = createLens(PersonSchema);
   *
   * // Get specific persons identified by IRIs
   * const matches = await Persons.findByIris([
   *   "http://dbpedia.org/resource/Ada_Lovelace",
   *   "http://dbpedia.org/resource/Alan_Turing"
   * ]);
   * console.log(matches[0].name); // string "Ada Lovelace"
   * console.log(matches[1].name); // string "Alan Turing"
   * ```
   *
   * @param iris IRIs of the entities to find
   * @returns Array of found entities, empty array if there are no matches
   */
  async findByIris(iris: IRI[]): Promise<Unite<SchemaInterface<T>>[]> {
    const q = this.queryBuilder.getByIrisQuery(iris);
    this.log(q);
    const graph = await this.engine.queryGraph(q);
    return this.decode(graph);
  }

  private updateQuery(query: string) {
    this.log(query);
    return this.engine.queryVoid(query);
  }

  /**
   * Inserts one or more entities to the data store.
   *
   * @example
   * ```typescript
   * import { createLens } from "ldkit";
   * import { schema } from "ldkit/namespaces";
   *
   * // Create a schema
   * const PersonSchema = {
   *   "@type": schema.Person,
   *   name: schema.name,
   * } as const;
   *
   * // Create a resource using the data schema above
   * const Persons = createLens(PersonSchema);
   *
   * // Insert a new person
   * await Persons.insert({
   *   $id: "http://example.org/Alan_Turing",
   *   name: "Alan Turing",
   * });
   * ```
   *
   * @param entities Entities to insert
   * @returns Nothing
   */
  insert(...entities: Entity<SchemaInterface<T>>[]): Promise<void> {
    const q = this.queryBuilder.insertQuery(entities);
    return this.updateQuery(q);
  }

  /**
   * Inserts raw RDF quads to the data store.
   *
   * This method is useful when you need to insert data that is not covered by the data schema.
   *
   * @example
   * ```typescript
   * import { createLens } from "ldkit";
   * import { schema } from "ldkit/namespaces";
   * import { DataFactory } from "ldkit/rdf";
   *
   * // Create a schema
   * const PersonSchema = {
   *   "@type": schema.Person,
   *   name: schema.name,
   * } as const;
   *
   * // Create a resource using the data schema above
   * const Persons = createLens(PersonSchema);
   *
   * // Create a custom quad to insert
   * const df = new DataFactory();
   * const quad = df.quad(
   *   df.namedNode("http://example.org/Alan_Turing"),
   *   df.namedNode("http://schema.org/name"),
   *   df.literal("Alan Turing"),
   * );
   *
   * // Insert the quad
   * await Persons.insertData(quad);
   * ```
   *
   * @param quads Quads to insert to the data store
   * @returns Nothing
   */
  insertData(...quads: RDF.Quad[]): Promise<void> {
    const q = this.queryBuilder.insertDataQuery(quads);
    return this.updateQuery(q);
  }

  /**
   * Updates one or more entities in the data store.
   *
   * @example
   * ```typescript
   * import { createLens } from "ldkit";
   * import { schema } from "ldkit/namespaces";
   *
   * // Create a schema
   * const PersonSchema = {
   *   "@type": schema.Person,
   *   name: schema.name,
   * } as const;
   *
   * // Create a resource using the data schema above
   * const Persons = createLens(PersonSchema);
   *
   * // Update Alan Turing's name
   * await Persons.update({
   *   $id: "http://example.org/Alan_Turing",
   *   name: "Not Alan Turing",
   * });
   * ```
   *
   * @param entities Partial entities to update
   * @returns Nothing
   */
  update(...entities: SchemaUpdateInterface<T>[]): Promise<void> {
    const q = this.queryBuilder.updateQuery(entities as Entity[]);
    return this.updateQuery(q);
  }

  /**
   * Deletes one or more entities from the data store.
   *
   * This method accepts IRIs of the entities to delete and attemps
   * to delete all triples from the database that corresponds to
   * the data schema. Other triples that are not covered by the data
   * schema will not be deleted.
   *
   * If you need to have more control of what triples to delete,
   * use {@link deleteData} instead.
   *
   * @example
   * ```typescript
   * import { createLens } from "ldkit";
   * import { schema } from "ldkit/namespaces";
   *
   * // Create a schema
   * const PersonSchema = {
   *   "@type": schema.Person,
   *   name: schema.name,
   * } as const;
   *
   * // Create a resource using the data schema above
   * const Persons = createLens(PersonSchema);
   *
   * // Delete a person
   * await Persons.delete("http://example.org/Alan_Turing");
   * ```
   *
   * @param identities Identities or IRIs of the entities to delete
   * @returns Nothing
   */
  delete(...identities: Identity[] | IRI[]): Promise<void> {
    const iris = identities.map((identity) => {
      return typeof identity === "string" ? identity : identity.$id;
    });

    const q = this.queryBuilder.deleteQuery(iris);
    return this.updateQuery(q);
  }

  /**
   * Deletes raw RDF quads from the data store.
   *
   * This method is useful when you need to delete data that is not covered by the data schema.
   *
   * @example
   * ```typescript
   * import { createLens } from "ldkit";
   * import { schema } from "ldkit/namespaces";
   * import { DataFactory } from "ldkit/rdf";
   *
   * // Create a schema
   * const PersonSchema = {
   *   "@type": schema.Person,
   *   name: schema.name,
   * } as const;
   *
   * // Create a resource using the data schema and context above
   * const Persons = createLens(PersonSchema);
   *
   * // Create a custom quad to insert
   * const df = new DataFactory();
   * const quad = df.quad(
   *   df.namedNode("http://example.org/Alan_Turing"),
   *   df.namedNode("http://schema.org/name"),
   *   df.literal("Alan Turing"),
   * );
   *
   * // Delete the quad
   * await Persons.deleteData(quad);
   * ```
   *
   * @param quads Quads to delete from the data store
   * @returns Nothing
   */
  deleteData(...quads: RDF.Quad[]): Promise<void> {
    const q = this.queryBuilder.deleteDataQuery(quads);
    return this.updateQuery(q);
  }
}
