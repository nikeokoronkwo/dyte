/** The Spurte Configuration */
import type {
  BundleOptions as DenoBundleOptions,
  UserInputConfig,
  esbuild,
} from "../../deps.ts";

export type SpurteMode = "development" | "production";

// TODO: Add support for https
interface SpurteServerConfig {
  /** The server port number. @default 8080 */
  port?: number;
  /** The hostname of the server. @default "localhost" */
  host?: string;

  https?: {
    cert?: string;

    key?: string;
  }
}

interface SpurteNPMConfig {
  /** Whether to install dependencies locally in a `node_modules` directory.
   *
   * @default false
   */
  nodeModulesDir?: boolean;
  /**
   * The package manager used to install the node modules, if any.
   * Defaults to undefined, meaning none will be used for installing dependencies, and Deno will be used to cache the npm dependencies
   *
   * if `nodeModulesDir` is undefined or false, this option is ignored.
   */
  packageManager?: "npm" | "pnpm" | "yarn" | "bun";
  /** The CDN to use to cache NPM dependencies during development.
   * Defaults to undefined for Spurte's own NPM dependency management.
   *
   * if `nodeModulesDir` is true, this option is ignored
   */
  cdn?: string;
}

// TODO: add logLevel, experimental, experimental.multiPackages, experimental.hmr
// TODO: support for other bundlers, loading page overrides
/**
 * The base Spurte Config.
 *
 * This contains the base definitions for Spurte Configuration
 */
export interface SpurteBaseConfig {
  /** The root of the spurte project. Can be absolute path or relative path (that doesn't start with '/' or '\\'). @default Deno.cwd() */
  root?: string;

  /** The base url path to use when serving the application. @default '/' */
  base?: string;

  /**
   * Directory to serve plain static assets.
   * If false, then no files will be served at the public directory
   */
  publicDir?: string | false;

  /**
   * Where to serve plain static assets at the root directory of the project url.
   * Defaults to undefined to serve at project root.
   *
   * If {@link SpurteBaseConfig#publicDir} is set to false, then this option is ignored.
   */
  publicRoot?: string;

  /** Explicitly set the mode and overwrite the default mode or mode passed via the command line. */
  mode?: SpurteMode;

  /** The plugins used in the given project */
  plugins?: object[];

  /**
   * The Deno configuration file, or equivalent JSON file used.
   * @default deno.json
   */
  denoConfig?: string;

  /**
   * Configure the server options for Spurte's development server
   */
  server?: SpurteServerConfig;

  /**
   * Config options for NPM packages used in the given project.
   *
   * NPM packages are denoted with the `npm:` specifier (`import React from "npm:react";`)
   */
  npm?: SpurteNPMConfig;

  dev?: {
    /**
     * Whether to bundle external dependencies or import them as-is.
     * Defaults to true, meaning url dependencies are bundled.
     *
     * @default true
     */
    bundleDeps?: boolean;

    /**
     * Whether to initiate a full reload upon receiving changes
     * @default false
     */
    fullReload?: boolean;
  };

  build?: {
    /**
     * The output directory for the build files
     */
    outdir?: string;

    /** Whether to minify output @default true */
    minify?: boolean;

    /** Whether to enable code splitting @default true */
    codesplitting?: boolean;

    /** Options to pass to ESBuild for production bundling */
    esbuildOptions?: esbuild.TransformOptions
  };

  /** Options to pass to deno */
  denoOptions?: DenoBundleOptions;
}

/**
 * The configuration for a Spurte project, usually gotten from a Spurte config file (`spurte.config.js` or `.spurterc`), that is used to configure the default behaviour of a Spurte project.
 *
 * The Spurte Configuration is used for configuring three major behaviours: The options used for running main spurte tasks like starting the dev server, Configuring module resolution during build and development, mainly for `npm:` and `jsr:` specifiers.
 *
 * @example
 * // Spurte Configuration in a spurte.config.js file
 * export default {
 * 	// define configuration here
 * };
 */
export interface SpurteConfig extends UserInputConfig, SpurteBaseConfig {}
