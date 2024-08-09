import { ServerOptions } from "../options/ServeOptions.ts";
import { SpurteConfig } from "../config/schema.ts";

export function createServerOptions(
  config: SpurteConfig,
  cwd: string,
): ServerOptions {
  return {
    dir: cwd,
    port: config.server?.port?.toString() ?? "8000",
    host: config.server?.host ?? "localhost",
    publicDir: config.publicDir !== false
      ? (config.publicDir ?? "public")
      : undefined,
    publicRoot: config.publicRoot ?? "/",
  };
}
