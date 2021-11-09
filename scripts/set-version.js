const yargs = require("yargs");
const {
  promises: { readFile, readdir, writeFile },
} = require("fs");

const projectDirectory = `${__dirname}/../library`;

/**
 * Main entrypoint
 * @param {{ version: string}} argv command line arguments
 */
async function run(argv) {
  const { version } = argv;

  const v = version.startsWith("v") ? version.substring(1) : version;

  console.log(`💥 Setting version of @ldkit packages to ${v}`);

  const packageDirectories = await readdir(projectDirectory);

  for (const packageDirectory of packageDirectories) {
    await setPackageVersion(`${projectDirectory}/${packageDirectory}`, v);
  }

  console.log("💥 DONE");
}

/**
 * Sets a version for one package
 * @param {string} packageDirectory directory containing a package.json
 * @param {string} version version to set
 */
async function setPackageVersion(packageDirectory, version) {
  const packageJsonFile = `${packageDirectory}/package.json`;
  const packageBuffer = await readFile(packageJsonFile);
  const packageJson = packageBuffer.toString();

  const packageNameMatch = packageJson.match(/"name":\s"@ldkit\/(.+)"/);
  const packageName = `@ldkit/${packageNameMatch[1]}`;

  const packageJsonModified = packageJson
    .replace(/"version":\s".+"/, `"version": "${version}"`)
    .replace(/"@ldkit\/([a-z-]+)":\s".+"/g, `"@ldkit/$1": "^${version}"`);

  await writeFile(packageJsonFile, packageJsonModified);

  console.log(`📦 Package ${packageName} set to version ${version}`);
}

yargs
  .command({
    command: "$0 <version>",
    description: "Sets version of all LDkit published packages",
    builder: (command) => {
      return command.positional("version", {
        description: "Example: v0.0.1",
        type: "string",
      });
    },
    handler: run,
  })
  .help()
  .strict(true)
  .version(false)
  .parse();
