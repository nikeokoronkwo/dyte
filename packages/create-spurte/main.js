// @deno-types="npm:@types/prompts"
import prompts from "npm:prompts";
import { parseArgs } from "jsr:@std/cli/parse-args";
import { join } from "jsr:@std/path/join";
import { blue, yellow } from "jsr:@std/fmt@~0.225.4/colors";

// parse the command line arguments
const parseResults = parseArgs(Deno.args);

/**
 * The questions to ask
 * @type {prompts.PromptObject<string>[]}
 */
const questions = [{
  type: "text",
  name: "name",
  message: "What's the name of your project",
  initial: "spurte-project",
  validate: (name) =>
    name.includes(".")
      ? "Project names cannot contain the dot ('.') character"
      : true,
}, {
  type: "select",
  name: "variant",
  message: "Pick a variant to use",
  choices: [{
    title: yellow("JavaScript"),
    value: "js",
  }, {
    title: blue("TypeScript"),
    value: "ts",
  }],
}];

// get directory to scaffold project
const dir = parseResults._.filter((f) => typeof f === "string").length === 0
  ? "."
  : parseResults._.filter((f) => typeof f === "string")[0];

const mainDir = join(Deno.cwd(), dir);

// ask user for prompts
const response = await prompts(questions);
