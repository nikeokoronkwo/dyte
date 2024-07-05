import { loadConfig, join } from "../../deps.ts";
import type { DyteConfig, DyteMode } from "./schema.ts";

export async function getConfiguration(
  options: any,
  args: string,
  cwd: string,
) {
  const { config, configFile } = await loadConfig<DyteConfig>({
    name: "dyte",
    defaultConfig: generateConfig(options, args),
  });
  if (config) return config;
  else return generateConfig(options, args);
}

export function generateConfig(
  mode: DyteMode,
  cwd: string,
): DyteConfig {
  return {
    root: cwd,
    base: "/",
    mode,
    publicDir: "public",
    server: {
      port: 8000,
      host: "localhost",
    },
    dev: {
      bundleDeps: true,
    },
  };
}
