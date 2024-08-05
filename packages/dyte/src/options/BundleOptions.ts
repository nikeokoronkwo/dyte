import type { DyteMode } from "../config/schema.ts";
import type { BundleOptions as DenoBundleOptions, esbuild } from "../../deps.ts";

/**
 * The bundle options used to configure Deno's native bundler
 *
 * These options are derived from the cli options and mainly from the Dyte Configuration.
 */
export interface BundleOptions {
  /** The current bundle mode being used */
  mode: DyteMode;

  /** The deno bundle options used for configuring the bundler */
  denoOptions?: DenoBundleOptions;

  outDir?: string;

  cwd: string;

  minify?: boolean;

  splitting?: boolean;
  
  esbuildOptions?: esbuild.TransformOptions;
}
