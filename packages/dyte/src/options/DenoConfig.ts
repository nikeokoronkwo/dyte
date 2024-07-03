import { normalize } from "https://deno.land/std@0.224.0/path/mod.ts";
import { CompilerOptions } from "https://deno.land/x/emit@0.38.2/mod.ts";

type DenoScope = Record<string, Record<string, string>>;
type DenoImport = Record<string, string>;

/** Base Configuration of a Deno Configuration File */
export interface DenoConfig {
  compilerOptions?: CompilerOptions;
  nodeModulesDir?: boolean;
  npmRegistry?: string;
  imports?: DenoImport;
  scopes?: DenoScope;
  importMap?: string;
}

/**
 * The configuration of a Deno JSON file (`deno.json` or `deno.jsonc`) as a JavaScript Object.
 */
export class DenoFile implements DenoConfig {
  compilerOptions: CompilerOptions | undefined;
  nodeModulesDir: boolean | undefined;
  npmRegistry: string | undefined;
  imports: DenoImport | undefined;
  importMap: string | undefined;
  scopes: DenoScope | undefined;

  constructor(options?: DenoConfig) {
    this.compilerOptions = options?.compilerOptions;
    this.nodeModulesDir = options?.nodeModulesDir;
    this.npmRegistry = options?.npmRegistry;
    this.imports = options?.imports;
    this.importMap = options?.importMap;
    this.scopes = options?.scopes;
  }

  static parse(path: string) {
    const data = JSON.parse(Deno.readTextFileSync(normalize(path)));
    return new DenoFile({
      compilerOptions: data.compilerOptions,
      nodeModulesDir: data.nodeModulesDir,
      npmRegistry: data.npmRegistry,
      imports: data.imports,
      importMap: data.importMap,
      scopes: data.scopes
    });
  }
}
