type NamespacePrototype = {
  iri: string;
  prefix: string;
  terms: readonly string[];
};

type NamespacePrefix<Namespace extends NamespacePrototype> =
  Namespace["prefix"];

type NamespaceIri<Namespace extends NamespacePrototype> = Namespace["iri"];

type NamespaceObject<Namespace extends NamespacePrototype> = {
  [Term in Namespace["terms"][number]]: `${NamespacePrefix<Namespace>}${Term}`;
};

export const createNamespace = <
  N extends NamespacePrototype,
  I = NamespaceIri<N>,
  P = NamespacePrefix<N>,
  O = NamespaceObject<N>,
>(
  namespaceSpec: N,
) =>
  Object.assign(
    //<X extends I>(f: [X]) =>
    //  `${namespaceSpec.prefix}:${f}` as `${string & P}${string & X}`,
    namespaceSpec.terms.reduce((acc, term) => {
      //acc[term] = `${namespaceSpec.prefix}${term}`
      acc[term] = `${namespaceSpec.iri}${term}`;
      return acc;
    }, {} as Record<string, string>),
    {
      $prefix: namespaceSpec["prefix"],
      $iri: namespaceSpec["iri"],
    },
  ) as O & {
    $prefix: P;
    $iri: I;
  };
