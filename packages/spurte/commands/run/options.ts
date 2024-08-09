import { SpurteMode } from "../../src/config/schema.ts";

export type RunOptions = {
  mode?: SpurteMode | undefined;
  launch?: true | undefined;
  tlsCert?: string | undefined;
  tlsKey?: string | undefined;
};
