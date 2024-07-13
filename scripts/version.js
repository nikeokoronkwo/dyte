#!/usr/bin/env deno

import { blue, green, red, yellow } from "jsr:@std/fmt/colors";
import { parseArgs } from "jsr:@std/cli/parse-args";
import { walk } from "jsr:@std/fs/walk";
import * as path from "jsr:@std/path";
import { existsSync } from "jsr:@std/fs/exists";

const result = parseArgs(Deno.args, {
  boolean: ["bump", "sync"],
  string: ["set"],
});

const denoJson = JSON.parse(await Deno.readTextFile("deno.json"));

/** @type {string} */
const version = result.set ?? denoJson.version;

if (result.bump) {
  console.log(`${green("This isn't supported by this script yet")}`);
} else {
  if (result._ > 0) {
    for (const arg in result._) {
      const denoConfigPath = path.join(arg, "deno.json");
      if (existsSync(denoConfigPath)) updateVersionAt(denoConfigPath);
      else console.log(yellow(`There is no package at ${arg}. Skipping...`));
    }
  } else {
    for await (
      const item of walk(path.join(Deno.cwd(), "packages"), {
        includeDirs: false,
        includeSymlinks: false,
        exts: [".json"],
      })
    ) {
      if (item.name === "deno.json") {
        await updateVersionAt(item.path);
      }
    }
  }
}

async function updateVersionAt(itemPath) {
  const directory = path.dirname(itemPath);
  console.info(blue(`Updating Version at ${directory} to ${version}`));
  const packageconfig = JSON.parse(await Deno.readTextFile(itemPath));
  packageconfig.version = version;
  Deno.writeTextFileSync(itemPath, JSON.stringify(packageconfig));

  const genVersionTsFile = path.join(directory, "gen", "version.ts");
  Deno.mkdirSync(path.dirname(genVersionTsFile), { recursive: true });
  Deno.createSync(genVersionTsFile);
  Deno.writeTextFileSync(genVersionTsFile, `export default "${version}"`);
  console.info(green(`Version Updated`));
}
