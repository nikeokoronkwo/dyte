import { DyteMode } from "../../src/config/schema.ts";

export type RunOptions = {
  mode?: DyteMode | undefined;
  launch?: true | undefined;
  tlsCert?: string | undefined;
  tlsKey?: string | undefined;
};
