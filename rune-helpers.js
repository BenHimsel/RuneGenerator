import seedrandom from "seedrandom";

// Find the Psuedo Random Count of Points of Interest
export function poi(seed) {
  const innerRng = seedrandom("poi" + seed);
  const poiRand = innerRng();
  switch (true) {
    case poiRand < 0.4:
      return 4;
    case poiRand >= 0.4 && poiRand < 0.85:
      return 5;
    case poiRand >= 0.85 && poiRand < 0.95:
      return 6;
    case poiRand >= 0.95 && poiRand < 1:
      return 7;
    default:
      break;
  }
}

// Check for parallel

// Build a set of Points of Interest, in a 3x5 grid expanded by 10 pixels with 5 pixels of padding
export function generatePOISet(seed, count) {
  const coordinates = new Set();
  const result = [];
  let counter = 0;

  while (coordinates.size < count) {
    counter++;
    const innerRngX = seedrandom("poisaltx" + seed + counter);

    // init outside if blocks
    let x = 5;
    let y = 5;
    // Count if a POI is on the leading edge or trailing edge
    let xLead = 0;
    let xTrail = 0;
    // If the first POI, weight starting on leading or trailing edge
    if (counter == 0) {
      if (innerRngX < 0.6) {
        x = 5;
        xLead++;
      } else if (innerRngX < 0.7 || innerRngX < 0.9) {
        x = (count - 1) * 10 + 5;
        xTrail++;
      } else {
        x = (Math.floor(innerRngX() * 100) % 3) * 10 + 5;
      }
      // If the last POI, weight filling a missing leading or trailing edge POI
    } else if (counter == count - 1) {
      if (xLead == 0) {
        x = 5;
      } else if (xLead != 0 && xTrail == 0) {
        x = (count - 1) * 10 + 5;
      } else {
        x = (Math.floor(innerRngX() * 100) % 3) * 10 + 5;
      }
    } else {
      x = (Math.floor(innerRngX() * 100) % 3) * 10 + 5;
    }

    const innerRngY = seedrandom("poisalty" + seed + counter);
    y = (Math.floor(innerRngY() * 100) % 5) * 10 + 5;
    const coordinate = [x, y];

    coordinates.add(JSON.stringify(coordinate));
  }

  coordinates.forEach((coord) => {
    result.push(JSON.parse(coord));
  });

  return result;
}

// Does the path have a dot or skip a POI
export function generateDotSkipIndex(seed, poiSet) {
  let dotIndex = -1;
  let skipIndex = -1;
  const innerRngDot = seedrandom("dot" + seed);
  const dotRand = innerRngDot();
  // Never Dot / Skip 4's
  // Seldomly Dot / Rarely Skip 5's
  if (poiSet.length == 5) {
    if (dotRand < 0.5) {
      dotIndex = Math.floor(dotRand * 10) % (poiSet.length - 1);
    } else if (dotRand >= 0.5 && dotRand < 0.7) {
      skipIndex = Math.floor(dotRand * 10) % (poiSet.length - 1);
    }
    // Often Dot / skip 6's
  } else if (poiSet.length == 6) {
    if (dotRand < 0.8) {
      dotIndex = Math.floor(dotRand * 10) % (poiSet.length - 1);
    } else if (dotRand >= 0.8 && dotRand < 0.95) {
      skipIndex = Math.floor(dotRand * 10) % (poiSet.length - 1);
    }
    // Always skip or dot 7's
  } else if (poiSet.length == 7) {
    if (dotRand < 0.8) {
      dotIndex = Math.floor(dotRand * 10) % (poiSet.length - 1);
    } else {
      skipIndex = Math.floor(dotRand * 10) % (poiSet.length - 1);
    }
  }

  const dotSkipIndex = {
    dot: dotIndex >= 0 ? true : false,
    skip: skipIndex >= 0 ? true : false,
    dotIndex: dotIndex,
    skipIndex: skipIndex,
  };

  return dotSkipIndex;
}

export function generateExtraPathPOIs(seed, poiSet) {
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
  const extraPOISubset = new Set();
  let incrementer = Math.floor(extraRand * 10);
  if (incrementer == poiSet.length) {
    incrementer--;
  }

  let extraPOIIndex = 0;
  while (extraPOISubset.size < extraPOICount) {
    extraPOIIndex = (extraPOIIndex + incrementer) % poiSet.length;
    extraPOISubset.add(extraPOIIndex);
  }

  return extraPOISubset;
}
