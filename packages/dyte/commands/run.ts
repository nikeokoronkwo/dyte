import { Command, EnumType, watchConfig, join, delay, exists } from "../deps.ts";
import type { RunOptions } from "./run/options.ts";

import { generateConfig } from "../src/config/config.ts";
import type { DyteConfig } from "../src/config/schema.ts";
import { createBundleOptions } from "../src/cli/createBundleOptions.ts";
import { createServerOptions } from "../src/cli/createServerOptions.ts";
import { type DyteActiveServer, serve } from "../src/server.ts";

import { DenoFile } from "../src/options/DenoConfig.ts";
import { Logger } from "../src/logger.ts";

const mode = new EnumType(["development", "production"]);

export default new Command()
  .type("dyte-mode", mode)
  .option("-m --mode <mode:dyte-mode>", "The mode to build for")
  .option("--launch", "Launch Web Browser once server is built.")
  .option(
    "--tls-cert <cert>",
    "The file location of a TLS Certificate to use HTTPS",
    {
      depends: ["tls-key"],
      hidden: true, // experimental and has not been implemented
    },
  )
  .option("--tls-key <key>", "The file location of a TLS Key to use HTTPS", {
    depends: ["tls-cert"],
    hidden: true, // experimental and has not been implemented
  })
  .arguments("[directory]")
  .action((options, args) => {
    runCommand(options, args);
  });

async function runCommand(options: RunOptions, args?: string) {
  // get cwd
  const cwd = join(Deno.cwd(), args ?? ".");
  const logger = new Logger();

  if (!(await exists(cwd))) {
    logger.error(`The directory at ${cwd} does not exist`, true);
    Deno.exit(1);
  }

  // load dyte config
  let appConfig: DyteConfig;
  let devServer: DyteActiveServer;

  // watch config for changes
  const config = await watchConfig({
    name: "dyte",
    defaultConfig: generateConfig("development", args ?? "."),
    cwd,
    onWatch: (event) => {
      console.log("[watcher]", event.type, event.path);
    },
    acceptHMR({ oldConfig, newConfig, getDiff }) {
      const diff = getDiff();
      if (diff.length === 0) {
        console.log("No config changed detected!");
        return true; // No changes!
      }
    },
    onUpdate({ oldConfig, newConfig, getDiff }) {
      const diff = getDiff();
      appConfig = newConfig.config ??
        generateConfig("development", args ?? ".");
      console.log("Config updated:\n" + diff.map(i => i.toJSON()).join("\n"));

      devServer.close(function () {
        console.log("Reloading Server....");
      });

      delay(800).then(() => {
        devServer = createDevServer(cwd, appConfig);
      });
    },
  });

  if (config.config) appConfig = config.config;
  else appConfig = generateConfig("development", args ?? ".");

  // get entry file
  devServer = createDevServer(cwd, appConfig);
}

/** 
 * @todo Extend implementation of {@link DyteServer} 
 */
function createDevServer(cwd: string, appConfig: DyteConfig) {
  // get deno config from deno.json file
  const deno = DenoFile.parse(join(appConfig.root ?? cwd, "deno.json"));

  // create configurations
  const bundleOptions = createBundleOptions(
    appConfig,
    deno,
    true,
  );

  const serveOptions = createServerOptions(appConfig, appConfig.root ?? cwd);

  // serve project
  const server = serve(serveOptions, bundleOptions);
  return server.listen(parseInt(serveOptions.port), () => {
    console.log(`App running on http://localhost:${serveOptions.port}`);
  });
}
