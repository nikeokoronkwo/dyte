import { existsSync, SEPARATOR } from "../../deps.ts";
import { DyteConfig } from "../config/schema.ts";

export function getEntryFile(
  cwd: string,
  appConfig?: DyteConfig,
): string | undefined {
  const srcDir = `${cwd}${SEPARATOR}src`;
  if (existsSync(`${srcDir}${SEPARATOR}main.ts`)) {
    return `${srcDir}${SEPARATOR}main.ts`;
  } else if (existsSync(`${srcDir}${SEPARATOR}app.ts`)) {
    return `${srcDir}${SEPARATOR}app.ts`;
  } else if (appConfig && appConfig?.root) {
    return `${appConfig.root}${SEPARATOR}src${SEPARATOR}main.ts`;
  }
}
