import { createRuneSVG } from "./rune-generate.js";

function createTable(itemLength, columns, caption, seed, inputbox) {
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
    inputbox.value = seedText;
  });

  return table;
}

function createRuneListTable(columns, caption, textarea, inputbox) {
  const table = document.createElement("table");
  const captionElement = document.createElement("caption");
  captionElement.textContent = caption;
  table.appendChild(captionElement);
  table.setAttribute("id", "rune-table");
  // Split the text into an array of strings using line breaks
  let lines = textarea.value.split("\n");

  // Remove any empty lines
  lines = lines.filter(function (line) {
    return line.trim() !== "";
  });
  let itemLength = lines.length;
  const numRows = Math.ceil(itemLength / columns);
  for (let i = 0; i < numRows; i++) {
    const row = table.insertRow();

    for (let j = 0; j < columns; j++) {
      const cell = row.insertCell();
      const dataIndex = i * columns + j;

      if (dataIndex < itemLength) {
        cell.appendChild(createRuneSVG(lines[dataIndex]));
        cell.setAttribute("seed", lines[dataIndex]);
      }
    }
  }

  table.addEventListener("click", function (event) {
    const td = event.target.closest("td");
    const seedText = td.getAttribute("seed");
    inputbox.value = seedText;
  });

  return table;
}

export function generateRuneTable() {
  const seedInput = document
    .getElementById("table-seed-input")
    .value.split("\n");
  const runeCountInput = document.getElementById("rune-count-input");
  const columnCountInput = document.getElementById("column-count-input");
  const runeTableDiv = document.getElementById("rune-table-div");
  const runeSeedInput = document.getElementById("rune-seed-input");
  runeTableDiv.innerHTML = "";
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

export function generateRuneListTable() {
  const runListTextarea = document.getElementById("rune-list-textarea");
  const columnCountInput = document.getElementById("column-count-input");
  const runeTableDiv = document.getElementById("rune-table-div");
  const runeSeedInput = document.getElementById("rune-seed-input");
  runeTableDiv.innerHTML = "";
  const columnCount = parseInt(columnCountInput.value);
  const runeTable = createRuneListTable(
    columnCount,
    "Generated Runes:",
    runListTextarea,
    runeSeedInput
  );
  runeTableDiv.appendChild(runeTable);
}

export function generateIndividualRune() {
  const seedInput = document.getElementById("rune-seed-input").value;
  const runeDiv = document.getElementById("rune-div");
  runeDiv.appendChild(createRuneSVG(seedInput));
  const runeListTextarea = document.getElementById("rune-list-textarea");
  runeListTextarea.value += seedInput + "\n";
}
