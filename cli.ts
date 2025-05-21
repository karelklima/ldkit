import { argv } from "node:process";
import { styleText } from "node:util";
import { readFileSync } from "node:fs";
import { Argument, Command } from "npm:commander@^13.1.0";

import { contextToSchema } from "./scripts/context_to_schema.ts";
import { shexcToSchema, shexjToSchema } from "./scripts/shex_to_schema.ts";
import { schemaToScript } from "./scripts/schema_to_script.ts";

const asciiArt = String.raw`
  _     ____  _    _ _   
 | |   |  _ \| | _(_) |_ 
 | |   | | | | |/ / | __|
 | |___| |_| |   <| | |_ 
 |_____|____/|_|\_\_|\__|
                                                              
`;

const program = new Command();

program
  .name("ldkit")
  .description("LDkit CLI utilities for Linked Data")
  .helpOption(false)
  .showHelpAfterError()
  .configureHelp({
    styleCommandDescription: (str) => styleText("gray", str),
    styleDescriptionText: (str) => styleText("gray", str),
    styleCommandText: (str) => styleText("cyan", str),
    styleArgumentText: (str) => styleText("yellow", str),
    styleSubcommandText: (str) => styleText("cyan", str),
  })
  .configureOutput({
    outputError: (str, write) => write(styleText("red", str)),
    stripColor: (str) => str,
  });

program.command("context-to-schema")
  .description("Convert a JSON-LD context from a file or URL to a LDkit schema")
  .addArgument(
    new Argument("<method>", "type of input").choices([
      "url",
      "file",
      "arg",
    ]),
  )
  .argument("<input>", "input JSON-LD context - file, URL, or string")
  .action(async (method, input) => {
    try {
      const resolvedInput = await resolve(method, input);
      const schema = await contextToSchema(JSON.parse(resolvedInput));
      console.log(schemaToScript(schema));
    } catch (error: unknown) {
      console.error(styleText("red", `${(error as Error).message}`));
    }
  });

program.command("shexc-to-schema")
  .description("Convert a ShExC schema from a file or URL to a LDkit schema")
  .addArgument(
    new Argument("<method>", "type of input").choices([
      "url",
      "file",
      "arg",
    ]),
  )
  .argument("<input>", "input ShExC schema - file, URL, or string")
  .action(async (method, input) => {
    try {
      const resolvedInput = await resolve(method, input);
      const schema = shexcToSchema(resolvedInput);
      console.log(schemaToScript(schema));
    } catch (error: unknown) {
      console.error(styleText("red", `${(error as Error).message}`));
    }
  });

program.command("shexj-to-schema")
  .description("Convert a ShExJ schema from a file or URL to a LDkit schema")
  .addArgument(
    new Argument("<method>", "type of input").choices([
      "url",
      "file",
      "arg",
    ]),
  )
  .argument("<input>", "input ShExJ schema - file, URL, or string")
  .action(async (method, input) => {
    try {
      const resolvedInput = await resolve(method, input);
      console.log("RESOLVED INPUT", resolvedInput);
      const schema = shexjToSchema(JSON.parse(resolvedInput));
      console.log(schemaToScript(schema));
    } catch (error: unknown) {
      console.error(styleText("red", `${(error as Error).message}`));
    }
  });

// Check if no arguments were provided
if (argv.length <= 2) {
  console.log(styleText("red", asciiArt));
  program.help(); // Automatically exits after printing help
} else {
  program.parse(argv);
}

async function resolve(method: string, input: string): Promise<string> {
  if (method === "url") {
    try {
      return await fetch(input).then((res) => res.text());
    } catch (error) {
      throw new Error(`Failed to fetch URL: ${input}.\n${error}`);
    }
  } else if (method === "file") {
    try {
      return readFileSync(input, "utf-8");
    } catch (error) {
      throw new Error(`Failed to read file: ${input}.\n${error}`);
    }
  } else if (method === "arg") {
    return input;
  }
  throw new Error(`Unknown resolution method: ${method}`);
}
