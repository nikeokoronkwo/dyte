import { Command, extname, join } from "../deps.ts";
import { generateConfig, getConfiguration } from "../src/config/config.ts";
import { DenoFile } from "../src/options/DenoConfig.ts";
import { createBundleOptions } from "../src/cli/createBundleOptions.ts";
import { bundle } from "../src/bundle.ts";
import { resolveEntry } from "../src/cli/resolveEntry.js";
import { hash } from "../src/cli/hash.js"

export default new Command()
  .option("-o --output <out>", "Output Directory for Code")
  .option("-e --entry <file>", "The entry JavaScript/TypeScript file for the project")
  .arguments("[directory]")
  .action(async (options, args) => {
    await buildCommand(options, args);
  });

async function buildCommand(options: {
  output?: string | undefined;
  entry?: string | undefined;
}, args?: string) {
  const denoCwd = Deno.cwd();
  const outDir = join(denoCwd, options?.output ?? "dist");

  Deno.mkdirSync(outDir, { recursive: true });
  
  // get cwd
  const cwd = join(denoCwd, args ?? ".");

  // get app config
  let appConfig = await getConfiguration(options, args ?? ".", cwd);
  if (!appConfig) appConfig = generateConfig("production", args ?? ".");

  const deno = DenoFile.parse(join(appConfig.root ?? cwd, "deno.json"));

  // create configurations
  const bundleOptions = createBundleOptions(
    appConfig,
    deno,
    true,
  );

  let resolvedEntry = await resolveEntry(cwd, appConfig, (f) => f.replace(extname(f), ".js"));
  let entryMap = resolvedEntry.map ?? new Map([[options.entry, `${(await hash(options.entry)).slice(0, 10)}.js`]]);
  const map = await bundle(Array.from(entryMap.keys()).map(e => join(appConfig.root ?? cwd, e)), bundleOptions);
  
}
