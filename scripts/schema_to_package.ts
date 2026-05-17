import {
  type ExtraNamespace,
  type SchemaSpec,
  schemaToScript,
} from "./schema_to_script.ts";

export type SchemaToPackageOptions = {
  prefixAliases?: Record<string, string>;
  schemaSourcePrefixes?: Map<string, string>;
};

export type SchemaPackage = {
  files: Map<string, string>;
};

const FALLBACK_FILE = "_unknown";
const NAMESPACES_FILE = "namespaces";

export function schemaToPackage(
  schemas: SchemaSpec[],
  extraNamespaces: ExtraNamespace[] = [],
  options: SchemaToPackageOptions = {},
): SchemaPackage {
  const aliases = options.prefixAliases ?? {};
  const sourcePrefixes = options.schemaSourcePrefixes ?? new Map();
  const fileForPrefix = (prefix: string | undefined): string => {
    if (!prefix) return FALLBACK_FILE;
    const aliased = aliases[prefix];
    return (aliased ?? prefix).toLowerCase();
  };

  const groups = new Map<string, SchemaSpec[]>();
  const schemaLocations = new Map<string, string>();
  for (const schema of schemas) {
    const file = fileForPrefix(sourcePrefixes.get(schema.name));
    schemaLocations.set(schema.name, file);
    let bucket = groups.get(file);
    if (!bucket) {
      bucket = [];
      groups.set(file, bucket);
    }
    bucket.push(schema);
  }

  const extraNamespaceTermsOverride = collectGlobalNamespaceTerms(
    extraNamespaces,
    schemas,
  );

  const files = new Map<string, string>();
  for (
    const [file, fileSchemas] of [...groups.entries()].toSorted(([a], [b]) =>
      a.localeCompare(b)
    )
  ) {
    const scopedExtras = filterExtras(extraNamespaces, fileSchemas);
    const contents = schemaToScript(fileSchemas, scopedExtras, {
      schemaLocations,
      currentFile: file,
      extraNamespacesImportFrom: NAMESPACES_FILE,
    });
    files.set(file, contents);
  }

  if (extraNamespaces.length > 0) {
    files.set(
      NAMESPACES_FILE,
      buildNamespacesFile(extraNamespaces, extraNamespaceTermsOverride),
    );
  }
  files.set("index", buildIndex(files));
  return { files };
}

function buildNamespacesFile(
  extras: ExtraNamespace[],
  termsByPrefix: Map<string, Set<string>>,
): string {
  const lines: string[] = [`import { createNamespace } from "ldkit";`, ""];
  const sorted = [...extras].sort((a, b) => a.prefix.localeCompare(b.prefix));
  for (const ns of sorted) {
    const terms = [...(termsByPrefix.get(ns.prefix) ?? new Set<string>())]
      .toSorted();
    lines.push(`export const ${ns.prefix} = createNamespace(`);
    lines.push(`  {`);
    lines.push(`    iri: ${JSON.stringify(ns.iri)},`);
    lines.push(`    prefix: ${JSON.stringify(`${ns.prefix}:`)},`);
    lines.push(`    terms: [`);
    for (const term of terms) {
      lines.push(`      ${JSON.stringify(term)},`);
    }
    lines.push(`    ],`);
    lines.push(`  } as const,`);
    lines.push(`);`);
    lines.push("");
  }
  return lines.join("\n");
}

function filterExtras(
  extras: ExtraNamespace[],
  schemas: SchemaSpec[],
): ExtraNamespace[] {
  if (extras.length === 0) return [];
  const usedIris = collectUsedIris(schemas);
  return extras.filter((ns) =>
    [...usedIris].some((iri) => iri.startsWith(ns.iri))
  );
}

function collectUsedIris(schemas: SchemaSpec[]): Set<string> {
  const used = new Set<string>();
  for (const schema of schemas) {
    for (const t of schema.type) used.add(t);
    for (const prop of Object.values(schema.properties)) {
      used.add(prop.id);
      if (prop.type) used.add(prop.type);
      if (prop.schema) {
        for (const iri of collectUsedIris([prop.schema])) used.add(iri);
      }
    }
  }
  return used;
}

function collectGlobalNamespaceTerms(
  extras: ExtraNamespace[],
  schemas: SchemaSpec[],
): Map<string, Set<string>> {
  const sortedExtras = [...extras].sort((a, b) => b.iri.length - a.iri.length);
  const result = new Map<string, Set<string>>();
  const allIris = collectUsedIris(schemas);
  for (const iri of allIris) {
    for (const ns of sortedExtras) {
      if (iri.startsWith(ns.iri)) {
        const term = iri.substring(ns.iri.length);
        let bucket = result.get(ns.prefix);
        if (!bucket) {
          bucket = new Set();
          result.set(ns.prefix, bucket);
        }
        bucket.add(term);
        break;
      }
    }
  }
  return result;
}

function buildIndex(files: Map<string, string>): string {
  const names = [...files.keys()].filter((f) => f !== "index").toSorted();
  return names.map((name) => `export * from "./${name}";`).join("\n") + "\n";
}
