/**
 * Popular namespaces used in Linked Data, fully compatible with LDkit,
 * offering autocompletion and type checking in IDE.
 *
 * Create your own namespaces using {@link createNamespace} helper.
 *
 * @example
 * ```typescript
 * import { rdf, schema } from "ldkit/namespaces";
 *
 * console.log(rdf.type); // "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
 * console.log(schema.Person); // "http://schema.org/Person"
 * ```
 *
 * @module
 */
export { dbo } from "./namespaces/dbo.ts";
export { dc } from "./namespaces/dc.ts";
export { dcterms } from "./namespaces/dcterms.ts";
export { foaf } from "./namespaces/foaf.ts";
export { gr } from "./namespaces/gr.ts";
export { ldkit } from "./namespaces/ldkit.ts";
export { owl } from "./namespaces/owl.ts";
export { rdf } from "./namespaces/rdf.ts";
export { rdfs } from "./namespaces/rdfs.ts";
export { schema } from "./namespaces/schema.ts";
export { sioc } from "./namespaces/sioc.ts";
export { skos } from "./namespaces/skos.ts";
export { xsd } from "./namespaces/xsd.ts";

export * from "./library/namespace.ts";
