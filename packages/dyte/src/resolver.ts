/**
 * Resolver to resolve imports in code to server endpoints for code resolution
 */
export class Resolver {
    code: string;
    sourceMap: Map<string, string>;
  
    private constructor(code: string, map: Map<string, string>) {
      this.code = code;
      this.sourceMap = map;
    }
  
    static resolve(code: string, map: Map<string, string>, _options?: object): string {
        return new Resolver(code, map).jsr().toString();
    }
  
    toString() {
      return this.code;
    }

    jsr() {
       this.code = this.code.replaceAll(
        /["']jsr:@([^/]+)\/([^@/";\n]+)(?:@([^/;\n]+))?(?:\/([^\n]+))?["']/g,
        (match, scope, name, version: string = "", path = ""): string => {
            const url = Array.from(this.sourceMap.keys()).find(e => validate(e, match));
            if (!url) {
                console.error("The given JSR URL could not be resolved in the source map");
                throw new Error("The given JSR URL could not be resolved in the source map");
            } else {
                return url;
            }
        }
       );
       return this;
    }
}


function validate(url: string, importPath: string): boolean {
    const pkgInfo = url.replace("https://jsr.io/", '');
    const importPkgInfo = importPath.replace("jsr:", '');
    // console.log(pkgInfo, importPkgInfo);
    
    let parts = importPkgInfo.split("@").slice(1);
    parts[0] = "@" + parts[0];
    const likeUrl = parts.join('/');
    const packageParts = likeUrl.split('/');
    
    // parts is either 4 or more, or 2
    if (pkgInfo.startsWith(importPkgInfo)) {
        if (packageParts.length >= 4) return true;
        else {
            if (pkgInfo.endsWith("mod.ts")) return true;
        }
    }

    // parts should be 3
    // TODO: add assert
    const urlParts = pkgInfo.split("/");
    console.log(packageParts, urlParts)

    if (packageParts.slice(0, 2).every((pp, index) => urlParts.slice(0, 2)[index] == pp)) {
        if (packageParts.length >= 4) {
            if (packageParts.every((pp, index) => urlParts[index] == pp)) return true;
        } else if (packageParts.slice(2).every((pp, index) => urlParts.slice(3)[index] == pp)) {
            return true;
        } else {
            if (pkgInfo.endsWith("mod.ts") && packageParts[2] == urlParts[2]) return true;
        }
    }



    return false;
}