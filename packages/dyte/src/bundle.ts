import {
  bundle as denoBundle,
  transpile as denoTranspile,
} from "../deps.ts";

import { BundleOptions } from "./options/BundleOptions.ts";

/**
 * Bundles the code given the file entry 
 */
export async function bundle(entry: string, options: BundleOptions) {
  if (options.mode === "development") {
    return await devBundle(entry, options);
  } else {
    return await prodBundle(entry, options);
  }
}

/**
 * The Dev Bundler/Transformer used to bundle code for a development server for Quetzal
 * @param entry - The file to bundle
 * @param options - The options used to configure the Quetzal Bundler
 */
async function devBundle(entry: string, options: BundleOptions) {
	const { code } = await denoBundle(entry, options.denoOptions);
	return code;
}

/**
 * The production Bundler or Transpiler used for bundling and minifying code for production.
 *
 * NOTE: The bundler uses Deno for bundling code by default, which does not support code splitting at the moment. You may need to use a code-splitting tool for such purpose.
 */
async function prodBundle(entry: string, options: BundleOptions) {
	const { code } = await denoBundle(entry, options.denoOptions);
	return code;
}


/**
 * The dev transpiler, used in transpiling deno files and updating the dependency graph for the Dyte Server
 */
export async function devTranspile(
  entry: string,
  options?: BundleOptions,
): Promise<Map<string, string>> {
  return await denoTranspile(entry, options?.denoOptions);
}


