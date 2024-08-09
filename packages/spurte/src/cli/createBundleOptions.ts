import type { BundleOptions } from "../options/BundleOptions.ts";
import type { SpurteConfig } from "../config/schema.ts";
import type { DenoConfig } from "../options/DenoConfig.ts";

export function createBundleOptions(
  config: SpurteConfig,
  denoConfig?: DenoConfig,
  dev: boolean = false,
): BundleOptions {
  if (dev || config.mode == "development") {
    return createDevBundleOptions(config, denoConfig);
  } else return createProdBundleOptions(config, denoConfig);
}

function createDevBundleOptions(
  config: SpurteConfig,
  denoConfig?: DenoConfig,
): BundleOptions {
  return {
    mode: config.mode ?? "development",
    cwd: config.root ?? Deno.cwd(),
    denoOptions: config.denoOptions ?? {
      compilerOptions: denoConfig?.compilerOptions,
      importMap: denoConfig?.imports
        ? {
          baseUrl: config.root,
          imports: denoConfig?.imports,
          scopes: denoConfig.scopes,
        }
        : denoConfig?.importMap,
    },
  };
}

function createProdBundleOptions(
  config: SpurteConfig,
  denoConfig?: DenoConfig,
): BundleOptions {
  return {
    mode: config.mode ?? "production",
    minify: config.build?.minify,
    outDir: config.build?.outdir,
    cwd: config.root ?? Deno.cwd(),
    denoOptions: {
      minify: true,
      compilerOptions: denoConfig?.compilerOptions,
      importMap: denoConfig?.imports
        ? {
          baseUrl: config.root,
          imports: denoConfig?.imports,
          scopes: denoConfig.scopes,
        }
        : denoConfig?.importMap,
    },
  };
}
