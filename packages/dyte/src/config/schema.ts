/** The Dyte Configuration */
import type {
  BundleOptions as DenoBundleOptions,
  UserInputConfig,
  esbuild,
} from "../../deps.ts";

export type DyteMode = "development" | "production";
type DyteLogLevel = "debug" | "info" | "warn" | "error" | "none"

// TODO: Add support for https
interface DyteServerConfig {
  /** The server port number. @default 8000 */
  port?: number;
  /** The hostname of the server. @default "localhost" */
  host?: string;

  https?: {
    /** The path to the https certificate used for creating the https server */
    cert?: string;

    /** The path to the https key used for creating the https server */
    key?: string;
  }
}

interface DyteNPMConfig {
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
   * Defaults to undefined for Dyte's own NPM dependency management.
   *
   * if `nodeModulesDir` is true, this option is ignored
   */
  cdn?: string;
}

// TODO: add logLevel, experimental, experimental.multiPackages, experimental.hmr
// TODO: support for other bundlers, loading page overrides
/**
 * The base Dyte Config.
 *
 * This contains the base definitions for Dyte Configuration
 */
export interface DyteBaseConfig {
  /** The root of the dyte project. Can be absolute path or relative path (that doesn't start with '/' or '\\'). @default Deno.cwd() */
  root?: string;

  /** The base url path to use when serving the application. @default '/' */
  base?: string;

  /**
   * Directory to serve plain static assets.
   * @default 'public/'
   */
  publicDir?: string;

  /**
   * Where to serve plain static assets at the root directory of the project url.
   * Defaults to undefined to serve at project root.
   */
  publicRoot?: string;

  /** Explicitly set the mode and overwrite the default mode or mode passed via the command line. */
  mode?: DyteMode;

  /** The plugins used in the given project */
  plugins?: object[];

  /**
   * The Deno configuration file, or equivalent JSON file used.
   * @default deno.json
   */
  denoConfig?: string;

  /** Development Options */
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
     * @default "dist"
     */
    outdir?: string;

    /** Whether to minify output @default true */
    minify?: boolean;

    /** Whether to enable code splitting @default true */
    codesplitting?: boolean;

    /** Options to pass to ESBuild for production bundling */
    esbuildOptions?: esbuild.TransformOptions
  };

  /**
   * Configure the server options for Dyte's development server
   */
  server?: DyteServerConfig;

  /**
   * Config options for NPM packages used in the given project.
   *
   * NPM packages are denoted with the `npm:` specifier (`import React from "npm:react";`)
   */
  npm?: DyteNPMConfig;

  /** Options to pass to deno */
  denoOptions?: DenoBundleOptions;

  /**
   * The logging level for the dyte server
   * @default "none"
   */
  logLevel?: DyteLogLevel;

  /**
   * Whether hot module replacement is active on the given project
   * @default true
   */
  hmr?: boolean;
}

/**
 * The configuration for a Dyte project, usually gotten from a Dyte config file (`dyte.config.js` or `.dyterc`), that is used to configure the default behaviour of a Dyte project.
 *
 * The Dyte Configuration is used for configuring three major behaviours: The options used for running main dyte tasks like starting the dev server, Configuring module resolution during build and development, mainly for `npm:` and `jsr:` specifiers.
 *
 * @example
 * // Dyte Configuration in a dyte.config.js file
 * export default {
 * 	// define configuration here
 * };
 */
export interface DyteConfig extends UserInputConfig, DyteBaseConfig {}
