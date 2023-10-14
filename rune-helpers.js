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
    case poiRand >= 0.85 && poiRand < 1:
      return 6;
    default:
      break;
  }
}

// Build a set of Points of Interest, in a 3x5 grid expanded by 10 pixels with 5 pixels of padding
export function generatePOISet(seed, count) {
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

// Does the path have a dot or skip a POI
export function generateDotSkipIndex(seed, poiSet) {
  let dotIndex = null;
  let skipIndex = null;
  if (poiSet.length > 4) {
    const innerRngDot = seedrandom("dot" + seed);
    const dotRand = innerRngDot();
    if (dotRand < 0.6) {
      dotIndex = Math.floor(dotRand * 10) % (poiSet.length - 1);
    } else if (dotRand < 0.8 && dotRand >= 0.6) {
      skipIndex = Math.floor(dotRand * 10) % (poiSet.length - 1);
    }
  }
  return [dotIndex, skipIndex];
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
