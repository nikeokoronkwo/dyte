import { bundle as denoBundle, transpile as denoTranspile, esbuild, join, extname } from "../deps.ts";

import { BundleOptions } from "./options/BundleOptions.ts";

/**
 * Bundles the code given the file entry
 */
export async function bundle(entry: string | string[], options: BundleOptions) {
  if (options.mode === "development" && typeof entry === "string") {
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
 * NOTE: The bundler uses ESBuild
 */
async function prodBundle(entry: string | string[], options: BundleOptions) {
const entries = typeof entry === "string" ? [entry] : entry;
  // bundle with esbuild
  const output = await esbuild.build({
    entryPoints: entries,
    outdir: options.outDir ?? join(options.cwd ?? Deno.cwd(), "dist"),
    bundle: true,
    minify: options.minify ?? true,
    splitting: options.splitting ?? true,
    chunkNames: 'chunks/[hash]',
    assetNames: 'assets/[hash]',
    sourcemap: true,
    write: true,
  });

  const outmap = entries.map(e => [e, e.replace(extname(e), ".js")])

  return outmap.reduce<{ [input: string] : string }>((p, c) => {
    p[c[0]] = c[1];
    return p;
  }, {});
}

/**
 * The dev transpiler, used in transpiling deno files and updating the dependency graph for the Spurte Server
 */
export async function devTranspile(
  entry: string,
  options?: BundleOptions,
): Promise<Map<string, string>> {
  return await denoTranspile(entry, options?.denoOptions);
}
