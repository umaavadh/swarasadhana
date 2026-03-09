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

// Map semitone index to swara name
const swaraMap = ['S', 'R1', 'R2', 'G1', 'G2', 'M1', 'M2', 'P', 'D1', 'D2', 'N1', 'N2'];

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

  swaraMap.forEach((swara) => {
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
  currentScale: string
): ClosestSwaraMatch | null {
  if (!detectedFrequency || detectedFrequency < 0) {
    return null;
  }

  // Get Sa frequency for current scale
  const saFrequency = scaleFrequencies[currentScale] || scaleFrequencies['C'];

  // Calculate semitones from Sa
  const semitones = 12 * Math.log2(detectedFrequency / saFrequency);

  // Determine octave
  let octave: OctaveLabel;
  if (detectedFrequency < saFrequency * 0.7) {
    octave = 'lower';
  } else if (detectedFrequency > saFrequency * 1.8) {
    octave = 'upper';
  } else {
    octave = 'middle';
  }

  // Normalize semitones to 0-11 range
  let normalizedSemitones = semitones % 12;
  if (normalizedSemitones < 0) {
    normalizedSemitones += 12;
  }

  // Find closest swara
  const swaraIndex = Math.round(normalizedSemitones) % 12;
  const swara = swaraMap[swaraIndex];

  // Calculate cents deviation from perfect pitch
  const exactSemitone = normalizedSemitones;
  const roundedSemitone = Math.round(normalizedSemitones);
  const cents = Math.round((exactSemitone - roundedSemitone) * 100);

  // Calculate target frequency (perfect pitch for this swara)
  const targetSemitones = swaraSemitones[swara];
  let targetFrequency = saFrequency * Math.pow(2, targetSemitones / 12);

  // Adjust target frequency for octave
  if (octave === 'lower') {
    targetFrequency = targetFrequency / 2;
  } else if (octave === 'upper') {
    targetFrequency = targetFrequency * 2;
  }

  return {
    swara: swara,
    octave: octave,
    cents: cents,
    frequency: detectedFrequency,
    targetFrequency: targetFrequency
  };
}
