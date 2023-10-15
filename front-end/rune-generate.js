import seedrandom from "seedrandom";
import {
  createRuneSVGPath,
  createRuneSVGDot,
  createRuneSVGParent,
} from "./svg-helpers.js";
import {
  poi,
  generatePOISet,
  generateDotSkipIndex,
  generateExtraPathPOIs,
} from "./rune-helpers.js";

export function createRuneSVG(seed) {
  // Find the Psuedo Random Count of Points of Interest
  const poiCount = poi(seed);
  // Build a set of Points of Interest, in a 3x5 grid expanded by 10 pixels with 5 pixels of padding
  const poiSet = generatePOISet(seed, poiCount);
  // Parent SVG Element
  const runeSVGParent = createRuneSVGParent(seed);
  // Does the path have a dot or skip a POI
  const dotSkipIndex = generateDotSkipIndex(seed, poiSet);
  // Choose the poi indices to have extra paths
  const extraPathPOIs = generateExtraPathPOIs(seed, poiSet);
  // Loop over the POI Set, generating paths
  for (let i = 0; i < poiSet.length - 1; i++) {
    // Make path or dot, depending on the dot/skip index

    // If it has a dot, and this the index of the dot, make the Dot
    if (dotSkipIndex.dot && i == dotSkipIndex.dotIndex) {
      const runeDot = createRuneSVGDot(poiSet, i);
      runeSVGParent.appendChild(runeDot);
      // If it's around a dot or the skip, skip it
    } else if (
      (dotSkipIndex.dot || dotSkipIndex.skip) &&
      (i == dotSkipIndex.dotIndex + 1 ||
        i == dotSkipIndex.dotIndex - 1 ||
        i == dotSkipIndex.skipIndex)
    ) {
      // If it has a dot and this is a path surrounding the dot, skip it
    } else {
      const runePath = createRuneSVGPath(poiSet, i, i + 1);
      runeSVGParent.appendChild(runePath);
    }

    // If the index is in the list of POIs with Extra Paths, loop over them
    if (extraPathPOIs.has(i)) {
      const innerRngExtraPath = seedrandom("poi" + seed);
      const extraPathRand = innerRngExtraPath();
      // Pseudo Random choose if 1 or 2 extra paths
      const extraPathCount = extraPathRand < 0.8 ? 1 : 2;

      // Choose the extra poi indices destinations
      const randomPathSubset = new Set();
      // Prime bigger than the set size, gotta be a better way.
      let pathincrementer = 11;

      // Pick destination POIs
      let pathIndex = 0;
      while (randomPathSubset.size < extraPathCount) {
        pathIndex = (pathIndex + pathincrementer) % poiSet.length;
        if (pathIndex != i) {
          randomPathSubset.add(pathIndex);
        }
      }

      // Make the paths to the destination POIs
      randomPathSubset.forEach((j) => {
        if (!(j == dotSkipIndex.dot || j == dotSkipIndex.skip)) {
          const runePath = createRuneSVGPath(poiSet, i, j);
          runeSVGParent.appendChild(runePath);
        }
      });
    }
  }

  // If the last POI is connected, make a path
  const innerRngConnected = seedrandom("connected" + seed);
  if (innerRngConnected() > 0.5) {
    const runePath = createRuneSVGPath(poiSet, poiSet.length - 1, 0);
    runeSVGParent.appendChild(runePath);
  }

  return runeSVGParent;
}
