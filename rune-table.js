import { runeDoc } from "./rune-generate.js";

function createTable(itemLength, columns, caption, seed) {
  const table = document.createElement("table");
  const captionElement = document.createElement("caption");
  captionElement.textContent = caption;
  table.appendChild(captionElement);
  const numRows = Math.ceil(itemLength / columns);
  for (let i = 0; i < numRows; i++) {
    const row = table.insertRow();

    for (let j = 0; j < columns; j++) {
      const cell = row.insertCell();
      const dataIndex = i * columns + j;

      if (dataIndex < itemLength) {
        cell.appendChild(runeDoc(seed + i + j, "svg"));
      }
    }
  }
  return table;
}

export function generateRuneTable() {
  const seedInput = document.getElementById("seed-input").value;
  const runeCountInput = document.getElementById("rune-count-input");
  const columnCountInput = document.getElementById("column-count-input");
  const runeTableDiv = document.getElementById("rune-table");
  runeTableDiv.innerHTML = ""; // Clear the existing list
  const runeCount = parseInt(runeCountInput.value);
  const columnCount = parseInt(columnCountInput.value);
  const runeTable = createTable(
    runeCount,
    columnCount,
    "Generated Runes:",
    seedInput
  );
  runeTableDiv.appendChild(runeTable);
}
