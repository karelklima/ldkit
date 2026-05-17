import {
  dbo,
  dc,
  dcterms,
  foaf,
  gr,
  ldkit,
  owl,
  rdf,
  rdfs,
  schema,
  sioc,
  skos,
  xsd,
} from "../namespaces.ts";

export const NAMESPACES = [
  dbo,
  dc,
  dcterms,
  foaf,
  gr,
  ldkit,
  owl,
  rdf,
  rdfs,
  schema,
  sioc,
  skos,
  xsd,
];

export type PropertySpec = {
  id: string;
  type?: string;
  schema?: SchemaSpec;
  schemaRef?: string;
  optional?: boolean;
  array?: boolean;
  multilang?: boolean;
  inverse?: boolean;
};

export type SchemaSpec = {
  name: string;
  type: string[];
  properties: {
    [key: string]: PropertySpec;
  };
};

export type ExtraNamespace = {
  iri: string;
  prefix: string;
};

export type PrinterOptions = {
  schemaLocations?: Map<string, string>;
  currentFile?: string;
  extraNamespaceFiles?: Map<string, string>;
  extraNamespaceTermsOverride?: Map<string, Set<string>>;
  extraNamespacesImportFrom?: string;
};

export function schemaToScript(
  schemas: SchemaSpec[],
  extraNamespaces: ExtraNamespace[] = [],
  options: PrinterOptions = {},
): string {
  const printer = new SchemaPrinter(extraNamespaces, options);
  return printer.print(schemas);
}

class SchemaPrinter {
  private usedNamespaces = new Set<string>();
  private space = "  ";
  // Sorted by IRI length desc so longer prefixes match before shorter ones.
  private extraNamespaces: ExtraNamespace[];
  private extraNamespaceTerms = new Map<string, Set<string>>();
  private readonly shadowedBuiltins: Set<string>;
  private readonly schemaLocations: Map<string, string>;
  private readonly currentFile: string | undefined;
  private readonly extraNamespaceFiles: Map<string, string>;
  private readonly extraNamespaceTermsOverride:
    | Map<string, Set<string>>
    | undefined;
  private readonly extraNamespacesImportFrom: string | undefined;
  private readonly crossFileImports = new Map<string, Set<string>>();

  constructor(
    extraNamespaces: ExtraNamespace[] = [],
    options: PrinterOptions = {},
  ) {
    this.extraNamespaces = [...extraNamespaces].sort(
      (a, b) => b.iri.length - a.iri.length,
    );
    this.shadowedBuiltins = new Set(
      this.extraNamespaces.map((ns) => ns.prefix),
    );
    this.schemaLocations = options.schemaLocations ?? new Map();
    this.currentFile = options.currentFile;
    this.extraNamespaceFiles = options.extraNamespaceFiles ?? new Map();
    this.extraNamespaceTermsOverride = options.extraNamespaceTermsOverride;
    this.extraNamespacesImportFrom = options.extraNamespacesImportFrom;
  }

  public print(schemas: SchemaSpec[]): string {
    const orderedSchemas = this.orderSchemasByDependencies(schemas);

    const printedSchemas: string[] = [];

    for (const schema of orderedSchemas) {
      this.extractNamespaces(schema);
      const printedSchema = this.printSchema(schema);
      printedSchemas.push(printedSchema);
    }

    const header = this.printHeader();
    if (header) {
      printedSchemas.unshift(header);
    }

    return printedSchemas.join("\n");
  }

  private orderSchemasByDependencies(schemas: SchemaSpec[]): SchemaSpec[] {
    const orderedSchemas: SchemaSpec[] = [];
    const processedSchemas = new Set<string>();
    const localNames = new Set(schemas.map((s) => s.name));

    const dependencies = schemas.map((schema) => {
      return {
        schemaName: schema.name,
        dependencies: this.getSchemaDependencies(schema).filter((dep) =>
          localNames.has(dep)
        ),
      };
    });

    let unresolved = schemas.length;

    while (unresolved > 0) {
      let progress = false;

      for (const info of dependencies) {
        if (processedSchemas.has(info.schemaName)) {
          continue;
        }

        const allDepsProcessed = info.dependencies.every((dep) =>
          processedSchemas.has(dep)
        );

        if (allDepsProcessed) {
          orderedSchemas.push(
            schemas.find((schema) => schema.name === info.schemaName)!,
          );
          processedSchemas.add(info.schemaName);
          unresolved--;
          progress = true;
        }
      }

      if (!progress) {
        throw new Error("Circular dependency detected");
      }
    }

    return orderedSchemas;
  }

  private getSchemaDependencies(schema: SchemaSpec): string[] {
    const dependencies: string[] = [];

    for (const property of Object.values(schema.properties)) {
      if (property.schemaRef) {
        dependencies.push(property.schemaRef);
      }
      if (property.schema) {
        dependencies.push(...this.getSchemaDependencies(property.schema));
      }
    }

    return dependencies;
  }

  private extractNamespace(value: string): void {
    if (value === "@id") {
      this.usedNamespaces.add(this.printPrefix(ldkit));
      return;
    }
    for (const ns of this.extraNamespaces) {
      if (value.startsWith(ns.iri)) {
        const localPart = value.substring(ns.iri.length);
        let terms = this.extraNamespaceTerms.get(ns.prefix);
        if (!terms) {
          terms = new Set<string>();
          this.extraNamespaceTerms.set(ns.prefix, terms);
        }
        terms.add(localPart);
        return;
      }
    }
    for (const namespace of NAMESPACES) {
      if (value.startsWith(namespace.$iri)) {
        const name = this.printPrefix(namespace);
        if (this.shadowedBuiltins.has(name)) {
          return;
        }
        this.usedNamespaces.add(name);
        return;
      }
    }
  }

  private extractNamespaces(schema: SchemaSpec): void {
    for (const typeValue of schema.type) {
      this.extractNamespace(typeValue);
    }

    for (const property of Object.values(schema.properties)) {
      this.extractNamespace(property.id);
      if (property.type) {
        this.extractNamespace(property.type);
      }
      if (property.schema) {
        this.extractNamespaces(property.schema);
      }
    }
  }

  private trackCrossFileRef(schemaRef: string): void {
    if (!this.currentFile) return;
    const refFile = this.schemaLocations.get(schemaRef);
    if (!refFile || refFile === this.currentFile) return;
    let names = this.crossFileImports.get(refFile);
    if (!names) {
      names = new Set();
      this.crossFileImports.set(refFile, names);
    }
    names.add(schemaRef);
  }

  private printHeader(): string {
    const lines: string[] = [];

    const usedPrefixes = new Set(this.extraNamespaces.map((ns) => ns.prefix))
      .intersection(new Set(this.extraNamespaceTerms.keys()));
    const usedExtras = this.extraNamespaces.filter((ns) =>
      usedPrefixes.has(ns.prefix)
    );

    const declaredExtras: ExtraNamespace[] = [];
    const importedByFile = new Map<string, Set<string>>();
    if (this.extraNamespacesImportFrom !== undefined) {
      if (usedExtras.length > 0) {
        importedByFile.set(
          this.extraNamespacesImportFrom,
          new Set(usedExtras.map((ns) => ns.prefix)),
        );
      }
    } else {
      for (const ns of usedExtras) {
        const home = this.extraNamespaceFiles.get(ns.prefix);
        if (!home || !this.currentFile || home === this.currentFile) {
          declaredExtras.push(ns);
          continue;
        }
        let names = importedByFile.get(home);
        if (!names) {
          names = new Set();
          importedByFile.set(home, names);
        }
        names.add(ns.prefix);
      }
    }

    if (declaredExtras.length > 0) {
      lines.push(`import { createNamespace } from "ldkit";`);
    }

    if (this.usedNamespaces.size > 0) {
      const namespacesString = Array.from(this.usedNamespaces)
        .toSorted()
        .join(", ");
      lines.push(`import { ${namespacesString} } from "ldkit/namespaces";`);
    }

    const crossFileEntries = [...this.crossFileImports.entries()]
      .toSorted(([a], [b]) => a.localeCompare(b));
    for (const [file, names] of crossFileEntries) {
      const sortedNames = [...names].toSorted().join(", ");
      lines.push(`import { ${sortedNames} } from "./${file}";`);
    }

    const importedExtraEntries = [...importedByFile.entries()]
      .toSorted(([a], [b]) => a.localeCompare(b));
    for (const [file, prefixes] of importedExtraEntries) {
      const sortedPrefixes = [...prefixes].toSorted().join(", ");
      lines.push(`import { ${sortedPrefixes} } from "./${file}";`);
    }

    if (lines.length > 0) {
      lines.push("");
    }

    for (const ns of declaredExtras) {
      const termSet = this.extraNamespaceTermsOverride?.get(ns.prefix) ??
        this.extraNamespaceTerms.get(ns.prefix)!;
      const terms = Array.from(termSet).toSorted();
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

  private printSchema(schema: SchemaSpec): string {
    const type = this.printType(schema);
    const properties = this.printProperties(schema);

    return [
      `export const ${schema.name} = {`,
      this.indent(type),
      this.indent(properties),
      `} as const;\n`,
    ].filter(Boolean).join("\n");
  }

  private printSubSchema(schema: SchemaSpec): string {
    const type = this.printType(schema);
    const properties = this.printProperties(schema);

    return [
      `"@schema": {`,
      this.indent(type),
      this.indent(properties),
      `},`,
    ].filter(Boolean).join("\n");
  }

  private printProperties(schema: SchemaSpec): string | null {
    if (Object.keys(schema.properties).length === 0) {
      return null;
    }

    return Object.entries(schema.properties)
      .map(([key, prop]) => this.printProperty(key, prop))
      .join("\n");
  }

  private printProperty(key: string, prop: PropertySpec): string {
    if (
      !prop.schema && !prop.schemaRef &&
      !prop.optional && !prop.array &&
      !prop.multilang && !prop.inverse &&
      (!prop.type || prop.type === xsd.string)
    ) {
      return `${this.printKey(key)}: ${this.printPrefixed(prop.id)},`;
    }

    const builder: string[] = [
      `${this.printKey(key)}: {`,
      this.indent(`"@id": ${this.printPrefixed(prop.id)},`),
    ];

    if (prop.type) {
      builder.push(this.indent(`"@type": ${this.printPrefixed(prop.type)},`));
    }

    if (prop.schema) {
      const subSchema = this.printSubSchema(prop.schema);
      builder.push(this.indent(subSchema));
    } else if (prop.schemaRef) {
      this.trackCrossFileRef(prop.schemaRef);
      builder.push(this.indent(`"@schema": ${prop.schemaRef},`));
    }

    const flags = ["optional", "array", "multilang", "inverse"];

    for (const flag of flags) {
      if (prop[flag as keyof PropertySpec]) {
        builder.push(this.indent(`"@${flag}": true,`));
      }
    }

    builder.push("},");

    return builder.join("\n");
  }

  private printType(schema: SchemaSpec): string | null {
    if (schema.type.length === 0) {
      return null;
    }

    if (schema.type.length === 1) {
      return `"@type": ${this.printPrefixed(schema.type[0])},`;
    }
    return [
      `"@type": [`,
      ...schema.type.map((type) => `  ${this.printPrefixed(type)},`),
      `],`,
    ].join("\n");
  }

  private printPrefix(namespace: { $prefix: string }): string {
    return namespace.$prefix.substring(0, namespace.$prefix.length - 1);
  }

  private printPrefixed(value: string): string {
    if (value === "@id") {
      return `${this.printPrefix(ldkit)}.IRI`;
    }
    for (const ns of this.extraNamespaces) {
      if (value.startsWith(ns.iri)) {
        const localPart = value.substring(ns.iri.length);
        return this.formatNamespaceAccess(ns.prefix, localPart);
      }
    }
    for (const namespace of NAMESPACES) {
      if (value.startsWith(namespace.$iri)) {
        const name = this.printPrefix(namespace);
        if (this.shadowedBuiltins.has(name)) {
          return `"${value}"`;
        }
        return `${name}.${value.substring(namespace.$iri.length)}`;
      }
    }
    return `"${value}"`;
  }

  private formatNamespaceAccess(prefix: string, localPart: string): string {
    if (/^[A-Za-z_$]\w*$/.test(localPart)) {
      return `${prefix}.${localPart}`;
    }
    return `${prefix}["${localPart}"]`;
  }

  private printKey(key: string): string {
    if (key.match(/^[a-zA-Z0-9_]+$/)) {
      return key;
    }
    return `"${key}"`;
  }

  private indent<T extends string | null>(text: T): T {
    if (text === null) {
      return null as T;
    }

    return text.split("\n")
      .map((line) => `${this.space}${line}`)
      .join("\n") as T;
  }
}
