import { DyteConfig } from "../config/schema.ts";

/**
 * An extension of {@link DyteConfig} that contains extra options, used mainly to interact with the Dyte API either for Server Side Rendering, or for integrating in your framework or project.
 * 
 * There are a few additional properties such as `configFile`, which specifies 
 */
interface DyteExtendedConfig extends DyteConfig {
    /** The config file to use for user configuration options. If not set, then Dyte will try to automatically resolve one from the project root */
    configFile?: string;

    /**
     * Whether to enable `.env` files
     * @todo Make use of this option
     */
    envFile?: boolean;
}

interface DyteResolvedConfig extends DyteConfig {

}

export type {
    DyteConfig,
    DyteExtendedConfig,
    DyteResolvedConfig
}