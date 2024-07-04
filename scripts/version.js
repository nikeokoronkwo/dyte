#!/usr/bin/env deno

import { parseArgs } from "jsr:@std/cli/parse-args"
import { walk } from "jsr:@std/fs/walk"
import * as path from "jsr:@std/path"

const result = parseArgs(Deno.args, {
    boolean: ["bump", "sync"],
    string: ["set"]
});

const denoJson = JSON.parse(await Deno.readTextFile("deno.json"));

/** @type {string} */
const version = result.set ?? denoJson.version;

if (result.bump) {
    if (result._ > 0) {

    } else {
        for await (const item of walk(Deno.cwd(), { includeDirs: false, includeSymlinks: false, exts: [".json"] })) {
            if (item.name === "deno.json") {
                const directory = path.dirname(item.path);
                let packageconfig;
            }
        }
    }
    // bump version
    
} else if (result._ > 0) {
    // sync version in packages
} else {
    // sync version in all
}