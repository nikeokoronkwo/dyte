import { BundleOptions } from "../options/BundleOptions.ts";
import { DyteConfig } from "../config/schema.ts";
import { DenoConfig } from "../options/DenoConfig.ts";

export function createBundleOptions(
  config: DyteConfig,
  denoConfig?: DenoConfig,
  dev: boolean = false,
): BundleOptions {
  if (dev) return createDevBundleOptions(config, denoConfig);
  else return createProdBundleOptions(config, denoConfig);
}

function createDevBundleOptions(
  config: DyteConfig,
  denoConfig?: DenoConfig,
): BundleOptions {
  return {
    mode: config.mode ?? "development",
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
  config: DyteConfig,
  denoConfig?: DenoConfig,
): BundleOptions {
  return {
    mode: config.mode ?? "production",
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
