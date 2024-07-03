import { Command } from "https://deno.land/x/cliffy@v1.0.0-rc.4/command/command.ts";
import { EnumType } from "https://deno.land/x/cliffy@v1.0.0-rc.4/command/types/enum.ts";
import { RunOptions } from "./run/options.ts";

import { watchConfig } from "npm:c12";
import { generateConfig } from "../src/config/config.ts";
import { DyteConfig } from "../src/config/schema.ts";
import { createBundleOptions } from "../src/cli/createBundleOptions.ts";

import { DenoConfig, DenoFile } from "../src/options/DenoConfig.ts"

const mode = new EnumType(["development", "production"]);

export const run = new Command()
.type("dyte-mode", mode)
.option('-m --mode <mode:dyte-mode>', "The mode to build for")
  .arguments("[directory]")
  .action((options: RunOptions, args) => {
    runCommand(options, args);
  });

  async function runCommand(options: RunOptions, args?: string) {
    // get cwd
    const cwd = Deno.cwd();
  
    // load dyte config
    let appConfig;
    let devServer;
  
    // watch config for changes
    const config = await watchConfig({
      name: "dyte",
      defaultConfig: generateConfig("production", args ?? ".", cwd),
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
        appConfig = newConfig.config ?? generateConfig("production", args ?? ".", cwd);
        console.log("Config updated:\n" + diff.map((i) => i.toJSON()).join("\n"));
  
        devServer.close(function () {
          console.log("Reloading Server....");
        });
  
        devServer = createDevServer(cwd, appConfig);
      },
    });
  
    if (config.config) appConfig = config.config;
    else appConfig = generateConfig(options, args ?? ".", cwd);
  
    // get entry file
    devServer = createDevServer(cwd, appConfig);
  }
  

function createDevServer(cwd: string, appConfig: DyteConfig) {
  // get deno config from deno.json file
  const deno = DenoFile.parse(appConfig.root ?? cwd);

  // create configurations
  const bundleOptions = createBundleOptions(
    appConfig,
    deno,
    true,
  );

  const serveOptions = createServerOptions(appConfig, cwd);

  // serve project
  const server = serve(serveOptions, bundleOptions);
  return server.listen(serveOptions.port, () => {
    console.log(`App running on http://localhost:${serveOptions.port}`);
  });
}
