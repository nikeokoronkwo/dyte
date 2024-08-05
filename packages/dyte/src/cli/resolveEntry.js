import { exists, join, DOMParser } from "../../deps.ts";
import { hash } from "./hash.js";

/**
 * 
 * @param {string} cwd 
 * @param {import("../api/configs.ts").DyteConfig} [appConfig]
 * @param {(filename: string) => string} [changeFunc]
 * @returns 
 */
export async function resolveEntry(
  cwd,
  appConfig,
  changeFunc
) {
  const indexFile = join(appConfig?.root ?? cwd, "index.html");
  if (await exists(indexFile)) {
    const content = await Deno.readTextFile(indexFile);
    const document = new DOMParser().parseFromString(content, "text/html");
    const bodyHTML = document.body.innerHTML;
    const headHTML = document.head.innerHTML;

    /** @type {Map<string, string>} */
    const map = new Map();

      // /** @type {Array<string>} */
    // const entryFiles = [];

    const scriptFiles = document.querySelectorAll("script");
    for (const node of scriptFiles) {
      if (node.getAttribute('src') !== null && node.getAttribute('src') !== "") {
        /** @type {string} */
        const src = node.getAttribute('src');
        if (src.startsWith("https://") || src.startsWith("http://")) continue;
        else {
          const newFileName = changeFunc ? changeFunc(src) : `${(await hash(v.fullPath)).slice(0, 10)}.js`;
          node.setAttribute("src", newFileName);
          map.set(src, newFileName);
        }
      }
    }

    const newBodyHTML = document.body.innerHTML;
    const newHeadHTML = document.head.innerHTML;

    return { map, body: content.replace(bodyHTML, newBodyHTML).replace(headHTML, newHeadHTML) }
  } else {
    throw Error("The index file could not be found at the project root");
  }
}
