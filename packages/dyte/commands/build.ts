import { Command, join } from "../deps.ts";
import { getConfiguration, generateConfig } from "../src/config/config.ts";
import { DenoConfig, DenoFile } from "../src/options/DenoConfig.ts";
import { createBundleOptions } from "../src/cli/createBundleOptions.ts";

export default new Command()
  .option("-o --output <out>", "Output Directory for Code")
  .arguments("[directory]")
  .action(async (options, args) => {
    await buildCommand(options, args);
  });

async function buildCommand(options: any, args?: string) {
  const denoCwd = Deno.cwd();
  const outDir = join(denoCwd, options?.output ?? "dist");
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

  const output = bundle();
}
