#!/usr/bin/env node
import fs from "fs";
import SVGIcons2SVGFontStream from "svgicons2svgfont";
import { createRuneSVG } from "./rune-generate.mjs";

export function createFont(fontName, seeds, outputFileName) {
  // Create a new SVGIcons2SVGFontStream instance
  const fontStream = new SVGIcons2SVGFontStream({
    fontName: fontName,
  });

  // Create the output file using the fs module
  const fileStream = fs.createWriteStream(outputFileName);
  fontStream.pipe(fileStream);

  for (let i = 0; i < seeds.length; i++) {
    const runeSeed = seeds[i];
    const runeSVG = createRuneSVG(runeSeed);
    const unicodeString = getUnicodeString(i);
    runeSVG.metadata = {
      unicode: [unicodeString],
      name: lines[i],
    };
    fontStream.write(runeSVG);
  }

  fontStream.end(); // Finalize the font creation
}

function getUnicodeString(decimalIndex) {
  let hexString;
  if (decimalIndex >= 0 && decimalIndex <= 25) {
    // U+0061 to U+007A
    hexString = (0x0061 + decimalIndex).toString(16).toUpperCase();
  } else if (decimalIndex >= 26 && decimalIndex <= 85) {
    // U+0041 to U+0060
    hexString = (0x0041 + (decimalIndex - 26)).toString(16).toUpperCase();
  } else if (decimalIndex >= 86 && decimalIndex <= 125) {
    // U+0021 to U+0040
    hexString = (0x0021 + (decimalIndex - 86)).toString(16).toUpperCase();
  } else if (decimalIndex >= 126 && decimalIndex <= 129) {
    // U+007B to U+007E
    hexString = (0x007b + (decimalIndex - 126)).toString(16).toUpperCase();
  } else {
    // U+00A1 onwards
    hexString = (0x00a1 + (decimalIndex - 130)).toString(16).toUpperCase();
  }

  // Pad with leading zeros and return in the '\uXXXX' format
  return `\\u${hexString.padStart(3, "0")}`;
}
