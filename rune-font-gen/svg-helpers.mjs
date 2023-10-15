import { createSVGWindow } from "svgdom";
import { SVG, registerWindow, Path, Circle } from "@svgdotjs/svg.js";

// From the POI Set, create an SVG Path from one POI to Another
export function appendRuneSVGPath(poiSet, start, end, svg) {
  let pathData = `M ${poiSet[start][0]} ${poiSet[start][1]}`; // Move to the first point
  pathData += ` L ${poiSet[end][0]} ${poiSet[end][1]}`; // Line to the next point

  let path = svg.path(pathData);
  path.fill("none");
  path.stroke({
    color: "black",
    width: 4,
    linecap: "round",
    linejoin: "round",
  });

  return svg;
}

// From the POI Set, create an SVG Circle at a point
export function appendRuneSVGDot(poiSet, index, svg) {
  svg.circle(2).move(poiSet[index][0], poiSet[index][1]).fill("black");

  return svg;
}

// Parent SVG Element
export function createRuneSVGParent(seed) {
  // returns a window with a document and an svg root node
  const window = createSVGWindow();
  const document = window.document;

  // register window and document
  registerWindow(window, document);
  const svg = SVG(document.documentElement);
  svg.size(300, 300);
  svg.id(seed);

  return svg;
}
