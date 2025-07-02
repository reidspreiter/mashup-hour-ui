/**
 * Determined whether a range of frequencies meet a threshold.
 * Use raw state to avoid conflicts from trigger and changing inversion setting.
 * @returns [raw state, state with applied inversion]
 */
export const booleanGate = (
  data: number[],
  frequencyX: number,
  amplitudeY: number,
  tolerance: number,
  sustained: boolean,
  inverted: boolean,
  prevRawState: boolean = false
): [boolean, boolean] => {
  const maxIndex = data.length - 1;
  const start = Math.max(0, frequencyX - tolerance);
  const end = Math.min(frequencyX + tolerance, maxIndex);

  let metThreshold = false;

  for (let i = start; i <= end; i++) {
    const amplitude = data[i];
    if (amplitude >= amplitudeY) {
      metThreshold = true;
      break;
    }
  }

  return [metThreshold, inverted !== (!sustained && prevRawState ? false : metThreshold)];
};

/**
 *
 * @param data data values from Tone Analyzer
 * @returns a more accurate logarithmic representation
 */
export const getLogData = (data: Float32Array): number[] => {
  const newData = [];
  const length = data.length;
  const maxLog = Math.log(length);
  const step = maxLog / length;

  for (let i = 0; i < length; i++) {
    // convert log space back to linear space
    newData.push(data[Math.floor(Math.exp(step * i))]);
  }
  return newData;
};

const easeInOutSine = (x: number): number => {
  return -(Math.cos(Math.PI * x) - 1) / 2;
};

/**
 *
 * @param data log-scaled data
 * @returns previous data with smoothed low frequencies
 */
export const smoothLowFrequencies = (data: number[]): number[] => {
  const cutoffPoint = Math.floor(data.length / 4);
  const firstSlice = data.slice(0, cutoffPoint * 3);
  const secondSlice = data.slice(cutoffPoint * 3);

  // collect groups of similar values and smooth them
  const newFirstSlice = [];
  let group = [firstSlice[0]];

  for (let i = 1; i < firstSlice.length; i++) {
    if (firstSlice[i] !== group[0]) {
      if (group[0] === 0) {
        newFirstSlice.push(...group);
      } else {
        const step = 1 / group.length;
        const difference = firstSlice[i] - group[0];

        for (let j = 0; j < group.length; j++) {
          newFirstSlice.push(group[0] + difference * easeInOutSine(step * j));
        }
      }
      group = [firstSlice[i]];
    } else {
      group.push(firstSlice[i]);
    }
  }

  for (let j = 0; j < group.length; j++) {
    newFirstSlice.push(group[0]);
  }

  return [...newFirstSlice, ...secondSlice];
};
