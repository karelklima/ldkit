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

const NAMESPACES = [
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

export function schemaToScript(schemas: SchemaSpec[]): string {
  const printer = new SchemaPrinter();
  return printer.print(schemas);
}

class SchemaPrinter {
  private usedNamespaces = new Set<string>();
  private space = "  ";

  public print(schemas: SchemaSpec[]): string {
    const orderedSchemas = this.orderSchemasByDependencies(schemas);

    const printedSchemas: string[] = [];

    for (const schema of orderedSchemas) {
      this.extractNamespaces(schema);
      const printedSchema = this.printSchema(schema);
      printedSchemas.push(printedSchema);
    }

    if (this.usedNamespaces.size > 0) {
      printedSchemas.unshift(this.printImports());
    }

    return printedSchemas.join("\n");
  }

  private orderSchemasByDependencies(schemas: SchemaSpec[]): SchemaSpec[] {
    const orderedSchemas: SchemaSpec[] = [];
    const processedSchemas = new Set<string>();

    const dependencies = schemas.map((schema) => {
      return {
        schemaName: schema.name,
        dependencies: this.getSchemaDependencies(schema),
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
    for (const namespace of NAMESPACES) {
      if (value.startsWith(namespace.$iri)) {
        this.usedNamespaces.add(this.printPrefix(namespace));
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

  private printImports(): string {
    const namespacesString = Array.from(this.usedNamespaces)
      .toSorted()
      .join(", ");

    return `import { ${namespacesString} } from "ldkit/namespaces";\n`;
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
    for (const namespace of NAMESPACES) {
      if (value.startsWith(namespace.$iri)) {
        return `${this.printPrefix(namespace)}.${
          value.substring(namespace.$iri.length)
        }`;
      }
    }
    return `"${value}"`;
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
