import { Command } from "https://deno.land/x/cliffy@v1.0.0-rc.4/command/command.ts";
import { getConfiguration } from "../src/config/config.ts";

export const build = new Command()
  .arguments("[directory]")
  .action(async (options, args) => {
    await buildCommand(options, args);
  });

async function buildCommand(options: any, args?: string) {
  // get cwd
  const cwd = Deno.cwd();

  // get app config
  const appConfig = await getConfiguration(options, args ?? ".", cwd);
}
