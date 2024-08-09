import { join, loadConfig } from "../../deps.ts";
import type { SpurteConfig, SpurteMode } from "./schema.ts";

export async function getConfiguration(
  options: any,
  args: string,
  cwd: string,
) {
  const { config, configFile } = await loadConfig<SpurteConfig>({
    name: "spurte",
    defaultConfig: generateConfig(options, args),
  });
  if (config) return config;
  else return generateConfig(options, args);
}

export function generateConfig(
  mode: SpurteMode,
  cwd: string,
  options?: {
    httpsCert?: string,
    httpsKey?: string,
  }
): SpurteConfig {
  return {
    root: cwd,
    base: "/",
    mode,
    publicDir: "public",
    server: {
      port: 8000,
      host: "localhost",
      https: (options?.httpsCert && options?.httpsKey) ? {
        cert: options?.httpsCert,
        key: options?.httpsKey,
      } : undefined,
    },
    dev: {
      bundleDeps: true,
    },
    build: {
      outdir: "build"
    }
  };
}
