// From the POI Set, create an SVG Path from one POI to Another
export function createRuneSVGPath(poiSet, start, end) {
  let pathData = `M ${poiSet[start][0]} ${poiSet[start][1]}`; // Move to the first point
  pathData += ` L ${poiSet[end][0]} ${poiSet[end][1]}`; // Line to the next point

  const pathElement = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );

  pathElement.setAttribute("d", pathData);
  pathElement.setAttribute("stroke", "black");
  pathElement.setAttribute("fill", "none");
  pathElement.setAttribute("stroke-linejoin", "round");
  pathElement.setAttribute("stroke-linecap", "round");
  pathElement.setAttribute("stroke-width", "4");

  return pathElement;
}

// From the POI Set, create an SVG Circle at a point
export function createRuneSVGDot(poiSet, index) {
  const circleElement = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle"
  );
  circleElement.setAttribute("cx", poiSet[index][0]);
  circleElement.setAttribute("cy", poiSet[index][1]);
  circleElement.setAttribute("r", "4");
  circleElement.setAttribute("fill", "black");

  return circleElement;
}

// Parent SVG Element
export function createRuneSVGParent(seed) {
  const svgElement = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg"
  );
  svgElement.setAttribute("width", "30");
  svgElement.setAttribute("height", "50");
  svgElement.setAttribute("id", seed);
  return svgElement;
}
