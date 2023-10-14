import "./style.css";
import { generateRuneTable } from "./rune-table.js";

document
  .querySelector("#generate")
  .addEventListener("click", () => generateRuneTable());

document.querySelector("#seed-input").value = Math.floor(
  Math.random() * 100000000
).toString();
