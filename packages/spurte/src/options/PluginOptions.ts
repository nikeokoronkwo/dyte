// not production ready: do not implement
export interface SpurtePlugin {
  name: string;

  resolve?: (url: string) => string | null;

  load?: (url: string) => string;
}
