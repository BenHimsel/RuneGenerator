import seedrandom from "seedrandom";

export function poi(seed) {
  const innerRng = seedrandom("poi" + seed);
  const poiRand = innerRng();
  switch (true) {
    case poiRand < 0.4:
      return 4;
    case poiRand >= 0.4 && poiRand < 0.85:
      return 5;
    case poiRand >= 0.85 && poiRand < 1:
      return 6;
    default:
      break;
  }
}

function generatePOISet(seed, count) {
  const coordinates = new Set();
  const result = [];
  let counter = 0;

  while (coordinates.size < count) {
    counter++;
    const innerRngX = seedrandom("poisaltx" + seed + counter);

    const row = (Math.floor(innerRngX() * 100) % 3) * 10 + 5;
    const innerRngY = seedrandom("poisalty" + seed + counter);
    const col = (Math.floor(innerRngY() * 100) % 5) * 10 + 5;
    const coordinate = [row, col];

    coordinates.add(JSON.stringify(coordinate));
  }

  coordinates.forEach((coord) => {
    result.push(JSON.parse(coord));
  });

  return result;
}

function createRuneSVGPath(poiSet, start, end) {
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

function createRuneSVGDot(poiSet, index) {
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

function createRuneSVGParent() {
  const svgElement = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg"
  );
  svgElement.setAttribute("width", "30");
  svgElement.setAttribute("height", "50");

  return svgElement;
}

function createRuneSVG(seed, poiSet) {
  const runeSVGParent = createRuneSVGParent();

  // Does dot that break the path, if so pick index
  let dotIndex = null;
  let skipIndex = null;
  if (poiSet.length > 4) {
    const innerRngDot = seedrandom("dot" + seed);
    const dotRand = innerRngDot();
    if (dotRand < 0.8 && dotRand >= 0.6) {
      skipIndex = Math.floor(dotRand * 10) % (poiSet.length - 1);
    } else if (dotRand < 0.6) {
      dotIndex = Math.floor(dotRand * 10) % (poiSet.length - 1);
    }
  }

  // Pick how many Points of Interest have extra paths
  const innerRngExtra = seedrandom("poi" + seed);
  const extraRand = innerRngExtra();
  let extraPOICount = 0;
  switch (true) {
    case extraRand >= 0.25 &&
      extraRand >= 0.9 - (1 - (poiSet.length + 12) / 18):
      extraPOICount = 1;
      break;
    case extraRand >= 0.9 - (1 - (poiSet.length + 12) / 18) && extraRand <= 1:
      extraPOICount = 2;
      break;
    default:
      break;
  }

  // Choose the poi indices to have extra paths
  const randomSubset = new Set();
  let incrementer = Math.floor(extraRand * 10);
  if (incrementer == poiSet.length) {
    incrementer--;
  }

  let extraPOIIndex = 0;
  while (randomSubset.size < extraPOICount) {
    extraPOIIndex = (extraPOIIndex + incrementer) % poiSet.length;
    randomSubset.add(extraPOIIndex);
  }

  for (let i = 0; i < poiSet.length - 1; i++) {
    if (dotIndex) {
      console.log("I have a dot");
      if (i == dotIndex) {
        console.log("The dot index matched i: " + i);
        const runeDot = createRuneSVGDot(poiSet, i);
        runeSVGParent.appendChild(runeDot);
      } else if (i == dotIndex - +1) {
        console.log("The dot index matched i + 1: " + (i + 1));
      } else {
        console.log("No match, i = " + i + ", dotIndex = " + dotIndex);
        const runePath = createRuneSVGPath(poiSet, i, i + 1);
        runeSVGParent.appendChild(runePath);
      }
    } else if (skipIndex) {
      console.log("I have a skip");
    } else {
      console.log("I don't have a dot or skip");
      const runePath = createRuneSVGPath(poiSet, i, i + 1);
      runeSVGParent.appendChild(runePath);
    }

    if (randomSubset.has(i)) {
      const innerRngExtraPath = seedrandom("poi" + seed);
      const extraPathRand = innerRngExtraPath();
      const extraPathCount = extraPathRand < 0.75 ? 1 : 2;

      // Choose the extra poi indices destinations
      const randomPathSubset = new Set();
      // Prime bigger than the set size, gotta be a better way.
      let pathincrementer = 7;

      let pathIndex = 0;
      while (randomPathSubset.size < extraPathCount) {
        pathIndex = (pathIndex + pathincrementer) % poiSet.length;
        if (pathIndex != i) {
          randomPathSubset.add(pathIndex);
        }
      }

      randomPathSubset.forEach((j) => {
        console.log("making path ij where i = " + i + " and j = " + j);
        if (j == dotIndex || j == skipIndex) {
          console.log(
            "I have a dot or skip, j = " + j + ", dotIndex = " + dotIndex
          );
        } else {
          const runePath = createRuneSVGPath(poiSet, i, j);
          runeSVGParent.appendChild(runePath);
        }
      });
    }
  }

  const innerRngConnected = seedrandom("connected" + seed);

  if (innerRngConnected() > 0.5) {
    const runePath = createRuneSVGPath(poiSet, poiSet.length - 1, 0);
    runeSVGParent.appendChild(runePath);
  }
  return runeSVGParent;
}

export function runeDoc(seed, type) {
  const poiCount = poi(seed);
  const poiSet = generatePOISet(seed, poiCount);
  if (type == "doc") {
    const runeDoc = {
      seed: seed,
      poiCount: poiCount,
      poiSet: poiSet,
    };
    return JSON.stringify(runeDoc);
  } else if (type == "svg") {
    const runeSVG = createRuneSVG(seed, poiSet);
    return runeSVG;
  }
}
