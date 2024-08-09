/**
 * Server Options
 * @todo Complete the documentation
 */
export interface ServerOptions {
  port: string;
  host: string;
  dir: string;
  dev?: boolean;
  cert?: string;
  key?: string;
  publicDir: string | undefined;
  publicRoot: string;
}
