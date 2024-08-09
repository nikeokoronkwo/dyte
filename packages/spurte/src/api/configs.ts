import { SpurteConfig } from "../config/schema.ts";

/**
 * An extension of {@link SpurteConfig} that contains extra options, used mainly to interact with the Spurte API either for Server Side Rendering, or for integrating in your framework or project.
 *
 * There are a few additional properties such as `configFile`, which specifies
 */
interface SpurteExtendedConfig extends SpurteConfig {
  /** The config file to use for user configuration options. If not set, then Spurte will try to automatically resolve one from the project root */
  configFile?: string;

  /**
   * Whether to enable `.env` files
   * @todo Make use of this option
   */
  envFile?: boolean;
}

interface SpurteResolvedConfig extends SpurteConfig {
}

export type { SpurteConfig, SpurteExtendedConfig, SpurteResolvedConfig };
