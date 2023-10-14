import "./style.css";
import {
  generateRuneTable,
  generateIndividualRune,
  generateRuneListTable,
} from "./rune-table.js";

document
  .querySelector("#generate-table")
  .addEventListener("click", () => generateRuneTable());

document
  .querySelector("#generate-list")
  .addEventListener("click", () => generateRuneListTable());

document
  .querySelector("#generate-rune")
  .addEventListener("click", () => generateIndividualRune());

document.querySelector("#table-seed-input").value = Math.floor(
  Math.random() * 100000000
).toString();
