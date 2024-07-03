import { ServerOptions } from "../options/ServeOptions.ts";
import { DyteConfig } from "../config/schema.ts";

export function createServerOptions(
  config: DyteConfig,
  cwd: string,
): ServerOptions {
  return {
    dir: cwd,
    port: config.server?.port?.toString() ?? "8080",
  };
}
