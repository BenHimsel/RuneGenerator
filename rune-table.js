import { createRuneSVG } from "./rune-generate.js";

function createTable(itemLength, columns, caption, seed, input) {
  const table = document.createElement("table");
  const captionElement = document.createElement("caption");
  captionElement.textContent = caption;
  table.appendChild(captionElement);
  table.setAttribute("id", "rune-table");
  const numRows = Math.ceil(itemLength / columns);
  for (let i = 0; i < numRows; i++) {
    const row = table.insertRow();

    for (let j = 0; j < columns; j++) {
      const cell = row.insertCell();
      const dataIndex = i * columns + j;

      if (dataIndex < itemLength) {
        const runeSeedContent = "rune" + seed + i + j;
        cell.appendChild(createRuneSVG("rune" + seed + i + j));
        cell.setAttribute("seed", runeSeedContent);
      }
    }
  }

  table.addEventListener("click", function (event) {
    const td = event.target.closest("td");
    const seedText = td.getAttribute("seed");
    input.value = seedText;
  });

  return table;
}

export function generateRuneTable() {
  const seedInput = document.getElementById("seed-input").value;
  const runeCountInput = document.getElementById("rune-count-input");
  const columnCountInput = document.getElementById("column-count-input");
  const runeTableDiv = document.getElementById("rune-table-div");
  const runeSeedInput = document.getElementById("rune-seed-input");
  runeTableDiv.innerHTML = ""; // Clear the existing list
  const runeCount = parseInt(runeCountInput.value);
  const columnCount = parseInt(columnCountInput.value);
  const runeTable = createTable(
    runeCount,
    columnCount,
    "Generated Runes:",
    seedInput,
    runeSeedInput
  );
  runeTableDiv.appendChild(runeTable);
}

export function generateIndividualRune() {
  const seedInput = document.getElementById("rune-seed-input").value;
  const runeDiv = document.getElementById("rune-div");
  runeDiv.appendChild(createRuneSVG(seedInput));
}
