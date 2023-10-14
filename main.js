import "./style.css";
import { generateRuneTable, generateIndividualRune } from "./rune-table.js";

document
  .querySelector("#generate-table")
  .addEventListener("click", () => generateRuneTable());

document
  .querySelector("#generate-rune")
  .addEventListener("click", () => generateIndividualRune());

document.querySelector("#seed-input").value = Math.floor(
  Math.random() * 100000000
).toString();
