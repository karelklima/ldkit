# Schema generators

LDkit provides experimental schema generators that help you convert existing
Linked Data definitions into TypeScript schemas compatible with LDkit. These
tools are available via the LDkit CLI and support generating code directly from
[JSON-LD Contexts](https://www.w3.org/TR/json-ld11/), [ShEx](https://shex.io/),
and [SHACL](https://www.w3.org/TR/shacl/).

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
npx ldkit context-to-schema url https://json-ld.org/contexts/person.jsonld
```

### 2. `shex-to-schema`

Converts a ShEx schema into an LDkit TypeScript schema.

```bash
npx ldkit shex-to-schema file ./schema.shex
```

### 3. `shacl-to-schema`

Converts a SHACL shape into an LDkit TypeScript schema.

```bash
npx ldkit shacl-to-schema arg 'ex:PersonShape a sh:NodeShape; ...'
```

## Command Syntax

```bash
npx ldkit <command> <method> <input>
```

- `<command>`: One of `context-to-schema`, `shex-to-schema`, or
  `shacl-to-schema`.

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
