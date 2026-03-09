export type OctaveLabel = 'lower' | 'middle' | 'upper';

export interface SwaraFrequency {
  swara: string;
  frequency: number;
  octaveLabel: OctaveLabel;
  semitones: number;
}

export interface ClosestSwaraMatch {
  swara: string;
  octave: OctaveLabel;
  cents: number;
  frequency: number;
  targetFrequency: number;
}

const scaleFrequencies: { [key: string]: number } = {
  'C': 261.63,
  'C#': 277.18,
  'D': 293.66,
  'D#': 311.13,
  'E': 329.63,
  'F': 349.23,
  'F#': 369.99,
  'G': 392.00,
  'G#': 415.30,
  'A': 440.00,
  'A#': 466.16,
  'B': 493.88
};

const swaraSemitones: { [key: string]: number } = {
  'S': 0,
  'R1': 1,
  'R2': 2,
  'G1': 3,
  'G2': 4,
  'M1': 5,
  'M2': 6,
  'P': 7,
  'D1': 8,
  'D2': 9,
  'N1': 10,
  'N2': 11
};

const swaraNames = ['S', 'R1', 'R2', 'G1', 'G2', 'M1', 'M2', 'P', 'D1', 'D2', 'N1', 'N2'];

export function calculateFrequencies(scale: string): {
  lowerOctave: SwaraFrequency[];
  middleOctave: SwaraFrequency[];
  upperOctave: SwaraFrequency[];
  allFrequencies: SwaraFrequency[];
} {
  const saFrequency = scaleFrequencies[scale] || scaleFrequencies['C'];

  const lowerOctave: SwaraFrequency[] = [];
  const middleOctave: SwaraFrequency[] = [];
  const upperOctave: SwaraFrequency[] = [];

  swaraNames.forEach((swara) => {
    const semitones = swaraSemitones[swara];
    const middleFrequency = saFrequency * Math.pow(2, semitones / 12);
    const lowerFrequency = middleFrequency / 2;
    const upperFrequency = middleFrequency * 2;

    lowerOctave.push({
      swara,
      frequency: lowerFrequency,
      octaveLabel: 'lower',
      semitones
    });

    middleOctave.push({
      swara,
      frequency: middleFrequency,
      octaveLabel: 'middle',
      semitones
    });

    upperOctave.push({
      swara,
      frequency: upperFrequency,
      octaveLabel: 'upper',
      semitones
    });
  });

  const allFrequencies = [...lowerOctave, ...middleOctave, ...upperOctave];

  return {
    lowerOctave,
    middleOctave,
    upperOctave,
    allFrequencies
  };
}

export function findClosestSwara(
  detectedFrequency: number,
  allFrequencies: SwaraFrequency[]
): ClosestSwaraMatch | null {
  if (!detectedFrequency || detectedFrequency <= 0 || allFrequencies.length === 0) {
    return null;
  }

  let closestMatch: SwaraFrequency | null = null;
  let minDifference = Infinity;

  allFrequencies.forEach((swaraFreq) => {
    const difference = Math.abs(swaraFreq.frequency - detectedFrequency);
    if (difference < minDifference) {
      minDifference = difference;
      closestMatch = swaraFreq;
    }
  });

  if (!closestMatch) {
    return null;
  }

  const cents = 1200 * Math.log2(detectedFrequency / closestMatch.frequency);

  return {
    swara: closestMatch.swara,
    octave: closestMatch.octaveLabel,
    cents: Math.round(cents),
    frequency: detectedFrequency,
    targetFrequency: closestMatch.frequency
  };
}
