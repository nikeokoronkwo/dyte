/**
 * Server Options
 * @todo Complete the documentation
 */
export interface ServerOptions {
  port: string;
  host: string;
  dir: string;
  dev?: boolean;
  publicDir: string | undefined;
  publicRoot: string;
}
