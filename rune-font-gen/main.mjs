#!/usr/bin/env node
import { Command } from "commander";
import figlet from "figlet";
// import { createFont } from "./font-helpers.mjs";
import { createRuneSVG } from "./rune-generate.mjs";
import { writeFile } from "fs/promises";
const program = new Command();

program
  .version("0.1.0")
  .description("Generates an Runic SVG Font from a list of seeds")
  .requiredOption("-n, --name <name>", "Specify a Font name")
  .requiredOption("-s, --seeds <seeds...>", "Specify a list of seeds")
  .requiredOption("-f, --file <file>", "Specify a file to save the font")
  .option("-v, --verbose", "Enable verbose logging")
  .parse(process.argv);

const options = program.opts();
if (options.verbose) {
  console.log(figlet.textSync("Rune Font Gen"));
  console.log("Name: " + options.name);
  console.log("Seeds: " + options.seeds);
  console.log("File: " + options.file);
}

(async () => {
  try {
    const svg = await createRuneSVG(options.seeds);
    await writeFile(options.file, svg.node.outerHTML);
    console.log("File written successfully.");
  } catch (err) {
    console.error(err);
  }
})();
