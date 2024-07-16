import { Folder } from "../src/file.js";
import { DenoConfig } from "jsr:@dyte/deno-config"

/** @type {DenoConfig} */
const denoConfig = {
    tasks: {
        dev: "dyte run",
        build: "dyte build"
    },
    imports: {
        dyte: "jsr:@dyte/dyte"
    }
}

export default (name) => new Folder(name, [
    new File("deno.json", JSON.stringify(denoConfig)),
    new File("dyte.config.js", "// add configuration here \nexport default {};"),
    new File("index.html", `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Dyte App</title>
    <script src="src/main.js"></script>
</head>
<body>
    <div id="app"></div>
</body>
</html>`)
], [
    new Folder("src", [
        new File("main.js", `const element = document.createElement("div");
element.innerHTML = \`<div>
    A Simple Web App made with Dyte!
</div>\`;

document.querySelector("#app").append(element)`)
    ])
]);