# Schema generators

LDkit provides experimental schema generators that help you convert existing
Linked Data definitions into TypeScript schemas compatible with LDkit. These
tools are available via the LDkit CLI and support generating code directly from
[JSON-LD contexts](https://www.w3.org/TR/json-ld11/),
[ShEx shapes](https://shex.io/), or
[SHACL shapes](https://www.w3.org/TR/shacl/).

> ⚠️ **Note:** These generators are experimental and currently support only a
> subset of the respective technologies. Manual review and adjustments of the
> generated schemas are recommended.

## Available Generators

### 1. `context-to-schema`

Converts a JSON-LD context into an LDkit TypeScript schema.

Supported JSON-LD features:

- property types
- containers of type `@language`, `@set` and `@list`
- `@reverse` properties
- nested `@context` entries

Since JSON-LD context do not support setting an arity of entities, all the
properties are considered required by default in the LDkit schema, which may
require manual adjustment.

#### Example:

```bash
npx ldkit context-to-schema url https://ldkit.io/examples/person.jsonld
```

### 2. `shexc-to-schema`

Converts a ShExC schema into an LDkit TypeScript schema.

Supported ShEx features:

- explicit property types
- property types inferred from enumerations (value sets)
- property cardinalities represented as optional and/or array properties
- expression choices represented as optional properties
- inverse properties
- nested shapes (both explicit and anonymous)
- simplified AND / OR shapes logic
- reuse of named triple expressions

```bash
npx ldkit shexc-to-schema url https://ldkit.io/examples/person.shex
```

### 3. `shexj-to-schema`

Converts a ShExJ schema into an LDkit TypeScript schema. Supported ShExJ
features are the same as for ShExC.

```bash
npx ldkit shexj-to-schema url https://ldkit.io/examples/person.shex.jsonld
```

### 4. `shacl-to-schema`

Converts a [SHACL](https://www.w3.org/TR/shacl/) shapes graph (Turtle) into an
LDkit TypeScript schema.

Supported SHACL features:

- **Project namespace generation** — every `@prefix` declaration in the source
  whose IRI is not an LDkit built-in is re-emitted at the top of the generated
  file as a `createNamespace()` call, and IRIs under that prefix render as e.g.
  `ex.totalRevenue` instead of raw IRI strings. When a user-declared prefix
  shadows an LDkit built-in's name (e.g. `schema` for `https://schema.org/` vs
  LDkit's built-in `http://schema.org/`), the user's prefix wins the clean
  variable name; the built-in is not imported and IRIs under it fall back to
  literal strings.
- `sh:NodeShape` discovery (named shapes only)
- `sh:targetClass` mapped to schema `@type` (multiple targets allowed)
- shapes that are also `rdfs:Class` use the shape IRI as `@type`
- `sh:property` shapes (named or blank node) with simple `sh:path` IRIs
- `sh:inversePath` mapped to `@inverse`
- `sh:datatype` mapped to property `@type` (XSD datatypes)
- `sh:nodeKind sh:IRI` mapped to IRI references (`ldkit.IRI`)
- `sh:node` and `sh:class` mapped to nested schema references
- `sh:datatype rdf:langString` and `sh:uniqueLang true` mapped to `@multilang`
- cardinality via `sh:minCount` / `sh:maxCount` mapped to `@optional` / `@array`
- simplified `sh:and` / `sh:or` shapes logic (mirrors `shexc-to-schema`):
  - `sh:and` branches are merged into the same property spec (last-wins for
    conflicting fields)
  - `sh:or` of numeric datatypes is reduced to the widest type
  - `sh:or` of identical datatypes uses that datatype
  - `sh:or` of `sh:node` / `sh:class` alternatives is reduced to an untyped IRI
    reference
  - `sh:or` of mixed or unrepresentable branches drops the type and the property
    is marked `@optional`
- `sh:in` enumerations use the type of the first list element (no TypeScript
  literal union — runtime cannot enforce it)
- `sh:not` and validation-only constraints (`sh:minLength`, `sh:maxLength`,
  `sh:pattern`, `sh:hasValue`, `sh:minInclusive`, etc.) are silently ignored,
  since LDkit's schema is for querying rather than validation

Unsupported (the converter throws a clear error if encountered):

- complex `sh:path` expressions other than `sh:inversePath` (sequence,
  alternative, zero-or-more)

Manual review of the generated schema is recommended, especially after `sh:or`
reduction.

```bash
npx ldkit shacl-to-schema file ./shapes.ttl
```

## Command Syntax

```bash
npx ldkit <command> <method> <input>
```

- `<command>`: One of `context-to-schema`, `shexc-to-schema`, `shexj-to-schema`,
  or `shacl-to-schema`.

- `<method>`: Defines how the input is provided. Possible values:

  - `url` — The input is a URL pointing to the resource.

  - `file` — The input is a path to a local file.

  - `arg` — The input is passed directly as a string argument.

- `<input>`: The actual input data, depending on the selected method.

## Output

The generators produce TypeScript code that can be used directly in your LDkit
projects. The output is printed to the console and can be redirected to a file:

```bash
npx ldkit context-to-schema url https://example.com/context.jsonld > schema.ts
```

## Installing the CLI

While the LDkit CLI may be called with `npx` command, it can also be installed.

Node:

```bash
npm install -g ldkit
```

Deno:

```bash
deno install -g -n ldkit https://deno.land/x/ldkit/cli.ts
```

After the script is installed, it can be called directly, for example:

```bash
ldkit context-to-schema file ./person.jsonld > person.ts
```

## Limitations

The generators do not fully cover all features of JSON-LD, ShEx, or SHACL.
Complex validation rules, advanced constraints, and some specialized constructs
may be omitted or simplified.

Manual post-processing of the generated schemas may be necessary for production
use.
