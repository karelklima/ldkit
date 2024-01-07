/**
 * RDF utilities
 *
 * This module contains a re-export of external RDF libraries that are used
 * in LDkit and may be used in tandem with LDkit in Linked Data applications as well.
 *
 * Included packages:
 * - [@rdfjs/types](https://github.com/rdfjs/types) [RDF/JS](https://rdf.js.org/) authoritative TypeScript typings
 * - [n3](https://rdf.js.org/N3.js/) RDF parser and serializer
 * - [rdf-data-factory](https://github.com/rubensworks/rdf-data-factory.js) A TypeScript/JavaScript implementation of the RDF/JS data factory
 * - [rdf-literal](https://github.com/rubensworks/rdf-literal.js) Translates between RDF literals and JavaScript primitives
 * @module
 */
export {
  DataFactory,
  DefaultGraph,
  fromRdf,
  N3,
  type RDF,
  toRdf,
} from "./library/rdf.ts";
