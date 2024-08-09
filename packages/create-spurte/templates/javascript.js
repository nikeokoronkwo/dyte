import { Folder } from "../src/file.js";

/** @type {import("jsr:@spurte/deno-config").DenoConfig} */
const denoConfig = {
  tasks: {
    dev: "spurte run",
    build: "spurte build",
  },
  imports: {
    spurte: "jsr:@spurte/spurte",
  },
};

export default (name) =>
  new Folder(name, [
    new File("deno.json", JSON.stringify(denoConfig)),
    new File(
      "spurte.config.js",
      "// add configuration here \nexport default {};",
    ),
    new File(
      "index.html",
      `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Spurte App</title>
    <script src="src/main.js"></script>
</head>
<body>
    <div id="app"></div>
</body>
</html>`,
    ),
  ], [
    new Folder("src", [
      new File(
        "main.js",
        `const element = document.createElement("div");
element.innerHTML = \`<div>
    A Simple Web App made with Spurte!
</div>\`;

document.querySelector("#app").append(element)`,
      ),
    ]),
  ]);
