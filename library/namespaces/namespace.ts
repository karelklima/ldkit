/** Original type of namespace specification */
export type Namespace = {
  iri: string;
  prefix: string;
  terms: readonly string[];
};

/** Resulting type of namespace providing access to all terms, prefix and IRI */
export type NamespaceInterface<NamespaceSpec extends Namespace> =
  & {
    [Term in NamespaceSpec["terms"][number]]:
      `${NamespaceSpec["prefix"]}${Term}`;
  }
  & {
    $prefix: NamespaceSpec["prefix"];
    $iri: NamespaceSpec["iri"];
  };

/**
 * Creates a strongly typed container for Linked Data vocabulary to provide
 * type safe access to all vocabulary terms as well as IDE autocompletion.
 *
 * @example
 * ```typescript
 * import { createNamespace } from "ldkit";
 *
 * const onto = createNamespace(
 *   {
 *     iri: "http://www.example.com/ontology#",
 *     prefix: "onto:",
 *     terms: [
 *       "object",
 *       "predicate",
 *       "subject",
 *     ],
 *   } as const,
 * );
 *
 * console.log(onto.subject); // prints http://www.example.com/ontology#subject
 * console.log(onto.unknown); // TypeScript error! This term does not exist
 * ```
 *
 * @param namespaceSpec Specification of the namespace
 * @returns
 */
export function createNamespace<N extends Namespace>(
  namespaceSpec: N,
): NamespaceInterface<N> {
  return Object.assign(
    namespaceSpec.terms.reduce((acc, term) => {
      acc[term] = `${namespaceSpec.iri}${term}`;
      return acc;
    }, {} as Record<string, string>),
    {
      $prefix: namespaceSpec["prefix"],
      $iri: namespaceSpec["iri"],
    },
  ) as unknown as NamespaceInterface<N>;
}
