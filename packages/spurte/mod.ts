/**
 * @file The Spurte API entrypoint
 * @copyright The Spurte Authors
 *
 * The Spurte API, used for interfacing with Spurte, as well as making use of Spurte in your own projects.
 *
 * Spurte has an easy to use TypeScript/JavaScript API to enable usage of Spurte in your larger projects/frameworks as a fully supported tool, as well as easy integration with Deno native APIs or your chosen backend framework to handle Deno frontend code.
 */

export type {
  SpurteConfig,
  SpurteExtendedConfig,
  SpurteResolvedConfig,
} from "./src/api/configs.ts";
