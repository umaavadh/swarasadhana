import { Music2, Mic, Target, Activity, Play, Square, Volume2, VolumeX } from 'lucide-react';
import { useState, useRef, useEffect, useMemo } from 'react';
import { calculateFrequencies, findClosestSwara, type SwaraFrequency, type ClosestSwaraMatch } from './pitchUtils';

const MusicalNotesWave = () => {
  return (
    <svg
      width="600"
      height="140"
      viewBox="0 0 600 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-2xl h-auto drop-shadow-lg"
    >
      <defs>
        <linearGradient id="noteGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
        <linearGradient id="noteGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fb923c" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>
        <linearGradient id="noteGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>

      {/* Five staff lines - standard music notation */}
      <line x1="30" y1="50" x2="570" y2="50" stroke="#d97706" strokeWidth="1.5" opacity="0.4" />
      <line x1="30" y1="60" x2="570" y2="60" stroke="#d97706" strokeWidth="1.5" opacity="0.4" />
      <line x1="30" y1="70" x2="570" y2="70" stroke="#d97706" strokeWidth="1.5" opacity="0.4" />
      <line x1="30" y1="80" x2="570" y2="80" stroke="#d97706" strokeWidth="1.5" opacity="0.4" />
      <line x1="30" y1="90" x2="570" y2="90" stroke="#d97706" strokeWidth="1.5" opacity="0.4" />

      {/* Decorative wave path flowing through notes */}
      <path
        d="M 0 70 Q 75 40, 150 60 T 300 50 T 450 75 T 600 55"
        stroke="#f59e0b"
        strokeWidth="2"
        fill="none"
        opacity="0.15"
        strokeDasharray="6 6"
      />

      {/* Quarter Note 1 - High on wave */}
      <g transform="translate(80, 15)">
        <ellipse cx="0" cy="25" rx="8" ry="9" fill="url(#noteGradient1)" transform="rotate(-20 0 25)" />
        <rect x="-1.5" y="0" width="3" height="25" fill="url(#noteGradient1)" />
      </g>

      {/* Eighth Note 1 - Mid wave */}
      <g transform="translate(150, 30)">
        <ellipse cx="0" cy="35" rx="8" ry="9" fill="url(#noteGradient2)" transform="rotate(-20 0 35)" />
        <rect x="-1.5" y="10" width="3" height="25" fill="url(#noteGradient2)" />
        <path d="M 1.5 10 Q 10 8 15 13" stroke="url(#noteGradient2)" strokeWidth="2.5" fill="none" />
      </g>

      {/* Beamed Eighth Notes - Low on wave */}
      <g transform="translate(220, 45)">
        <ellipse cx="0" cy="40" rx="8" ry="9" fill="url(#noteGradient3)" transform="rotate(-20 0 40)" />
        <rect x="-1.5" y="15" width="3" height="25" fill="url(#noteGradient3)" />
        <ellipse cx="25" cy="45" rx="8" ry="9" fill="url(#noteGradient3)" transform="rotate(-20 25 45)" />
        <rect x="23.5" y="20" width="3" height="25" fill="url(#noteGradient3)" />
        <rect x="1.5" y="15" width="25" height="3" fill="url(#noteGradient3)" />
      </g>

      {/* Quarter Note 2 - Mid-high */}
      <g transform="translate(300, 25)">
        <ellipse cx="0" cy="30" rx="8" ry="9" fill="url(#noteGradient1)" transform="rotate(-20 0 30)" />
        <rect x="-1.5" y="5" width="3" height="25" fill="url(#noteGradient1)" />
      </g>

      {/* Half Note - Mid */}
      <g transform="translate(370, 20)">
        <ellipse cx="0" cy="30" rx="8" ry="9" fill="white" stroke="url(#noteGradient2)" strokeWidth="2.5" transform="rotate(-20 0 30)" />
        <rect x="-1.5" y="5" width="3" height="25" fill="url(#noteGradient2)" />
      </g>

      {/* Eighth Note 2 - Low */}
      <g transform="translate(440, 50)">
        <ellipse cx="0" cy="35" rx="8" ry="9" fill="url(#noteGradient3)" transform="rotate(-20 0 35)" />
        <rect x="-1.5" y="10" width="3" height="25" fill="url(#noteGradient3)" />
        <path d="M 1.5 10 Q 10 8 15 13" stroke="url(#noteGradient3)" strokeWidth="2.5" fill="none" />
      </g>

      {/* Quarter Note 3 - Rising */}
      <g transform="translate(510, 30)">
        <ellipse cx="0" cy="30" rx="8" ry="9" fill="url(#noteGradient1)" transform="rotate(-20 0 30)" />
        <rect x="-1.5" y="5" width="3" height="25" fill="url(#noteGradient1)" />
      </g>
    </svg>
  );
};

type NoteInfo = {
  western: string;
  swara: string;
  isBlack: boolean;
};

const noteMapping: NoteInfo[] = [
  { western: 'C', swara: 'S', isBlack: false },
  { western: 'C#', swara: 'R1', isBlack: true },
  { western: 'D', swara: 'R2', isBlack: false },
  { western: 'D#', swara: 'G1', isBlack: true },
  { western: 'E', swara: 'G2', isBlack: false },
  { western: 'F', swara: 'M1', isBlack: false },
  { western: 'F#', swara: 'M2', isBlack: true },
  { western: 'G', swara: 'P', isBlack: false },
  { western: 'G#', swara: 'D1', isBlack: true },
  { western: 'A', swara: 'D2', isBlack: false },
  { western: 'A#', swara: 'N1', isBlack: true },
  { western: 'B', swara: 'N2', isBlack: false },
];

const thaaatPresets: { [key: string]: string[] } = {
  'None': [],
  'Bilawal Thaat': ['S', 'R2', 'G2', 'M1', 'P', 'D2', 'N2'],
  'Kafi Thaat': ['S', 'R2', 'G1', 'M1', 'P', 'D2', 'N1'],
  'Bhairav Thaat': ['S', 'R1', 'G2', 'M1', 'P', 'D1', 'N2'],
  'Kalyan Thaat': ['S', 'R2', 'G2', 'M2', 'P', 'D2', 'N2'],
  'Khamaj Thaat': ['S', 'R2', 'G2', 'M1', 'P', 'D2', 'N1'],
  'Asavari Thaat': ['S', 'R2', 'G1', 'M1', 'P', 'D1', 'N1'],
  'Bhairavi Thaat': ['S', 'R1', 'G1', 'M1', 'P', 'D1', 'N1'],
};

const tanpuraAudio: { [key: string]: string } = {
  "C":  "/audio/tanpura-C.mp3",
  "C#": "/audio/tanpura-Cs.mp3",
  "D":  "/audio/tanpura-D.mp3",
  "D#": "/audio/tanpura-Ds.mp3",
  "E":  "/audio/tanpura-E.mp3",
  "F":  "/audio/tanpura-F.mp3",
  "F#": "/audio/tanpura-Fs.mp3",
  "G":  "/audio/tanpura-G.mp3",
  "G#": "/audio/tanpura-Gs.mp3",
  "A":  "/audio/tanpura-A.mp3",
  "A#": "/audio/tanpura-As.mp3",
  "B":  "/audio/tanpura-B.mp3"
};

const swaraNames: { [key: string]: string } = {
  "S": "Shadja",
  "R1": "Komal Rishabh",
  "R2": "Shuddh Rishabh",
  "G1": "Komal Gandhar",
  "G2": "Shuddh Gandhar",
  "M1": "Shuddh Madhyam",
  "M2": "Tivra Madhyam",
  "P": "Pancham",
  "D1": "Komal Dhaivat",
  "D2": "Shuddh Dhaivat",
  "N1": "Komal Nishad",
  "N2": "Shuddh Nishad"
};

interface NoteHistoryItem {
  id: number;
  swara: string;
  frequency: number;
  timestamp: number;
  octave: 'lower' | 'middle' | 'upper';
  isCorrect: boolean;
  cents: number;
  color: 'red' | 'green' | 'yellow' | 'gray';
}

// Helper function to get full swara name
const getSwaraName = (swara: string): string => {
  return swaraNames[swara] || swara;
};

function App() {
  // === GLOBAL STATE MANAGEMENT ===

  // Step 1: Scale and Note Selection
  const [selectedScale, setSelectedScale] = useState('C'); // Current scale (Sa position)
  const [selectedNotes, setSelectedNotes] = useState<Set<string>>(new Set()); // Selected swaras from piano
  const [selectedPreset, setSelectedPreset] = useState('None'); // Current thaat preset
  const scales = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

  // Step 2: Tanpura Playback
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);

  // Step 3: Vocal Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false); // Analysis on/off
  const [noteHistory, setNoteHistory] = useState<NoteHistoryItem[]>([]); // Continuous note tracker

  // Real-time current note display (updates every ~100ms)
  const [currentNote, setCurrentNote] = useState<string>('–'); // Current detected swara
  const [currentNoteName, setCurrentNoteName] = useState<string>(''); // Frequency display
  const [currentCents, setCurrentCents] = useState<number>(0); // Pitch deviation in cents
  const [currentIsCorrect, setCurrentIsCorrect] = useState<boolean>(false); // Is note in selection
  const [currentOctave, setCurrentOctave] = useState<'lower' | 'middle' | 'upper'>('middle'); // Current octave

  // === REFS FOR AUDIO PROCESSING ===

  // Tanpura audio element
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Web Audio API components for pitch detection
  const audioContextRef = useRef<AudioContext | null>(null); // Audio context
  const analyserRef = useRef<AnalyserNode | null>(null); // FFT analyzer
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null); // Mic input
  const animationFrameRef = useRef<number | null>(null); // Animation loop ID
  const streamRef = useRef<MediaStream | null>(null); // Media stream

  // UI refs
  const noteTrackerRef = useRef<HTMLDivElement | null>(null); // Note history scroll container
  const nextNoteId = useRef(1); // Unique ID generator for note history

  // === FREQUENCY CALCULATION ===
  // Calculate all swara frequencies based on selected scale
  // This recalculates whenever the scale changes (e.g., C to D)
  const frequencyData = useMemo(() => {
    return calculateFrequencies(selectedScale);
  }, [selectedScale]);

  // === START VOCAL ANALYSIS ===
  // Initializes microphone input and Web Audio API for pitch detection
  const startVocalAnalysis = async () => {
    try {
      // Request microphone access with optimal settings for vocal detection
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true, // Remove echo
          noiseSuppression: true, // Reduce background noise
          autoGainControl: false  // Keep consistent volume for accurate pitch
        }
      });

      streamRef.current = stream;

      // Create Web Audio API context (cross-browser compatible)
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioContextClass();

      // Create analyzer node for frequency analysis
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 2048; // FFT size (higher = more frequency resolution)
      analyserRef.current.smoothingTimeConstant = 0.8; // Smoothing for stability

      // Connect microphone to analyzer
      microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream);
      microphoneRef.current.connect(analyserRef.current);

      setIsAnalyzing(true);

      // Start continuous pitch detection loop
      detectPitchContinuously();
    } catch (error: any) {
      console.error('Microphone access error:', error);

      // User-friendly error messages
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        alert('Microphone access denied. Please allow microphone permission in your browser settings and try again.');
      } else if (error.name === 'NotFoundError') {
        alert('No microphone found. Please connect a microphone and try again.');
      } else {
        alert('Error accessing microphone: ' + error.message);
      }
    }
  };

  // === STOP VOCAL ANALYSIS ===
  // Cleanly shuts down all audio processing and resets state
  const stopVocalAnalysis = () => {
    // Stop animation loop
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    // Disconnect audio nodes
    if (microphoneRef.current) {
      microphoneRef.current.disconnect();
      microphoneRef.current = null;
    }

    // Stop microphone stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    // Close audio context
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    // Reset real-time display to initial state
    setCurrentNote('–');
    setCurrentNoteName('');
    setCurrentCents(0);
    setCurrentIsCorrect(false);
    setCurrentOctave('middle');

    setIsAnalyzing(false);
  };

  // === UTILITY FUNCTIONS ===

  // Clear all notes from history tracker
  const clearNoteHistory = () => {
    setNoteHistory([]);
  };

  // Get array of selected swaras from piano
  const getSelectedSwaras = (): string[] => {
    return Array.from(selectedNotes);
  };

  // Determine color coding for note history items based on stored color
  // Red = wrong note (not selected)
  // Green = perfect pitch (±15¢)
  // Yellow = slightly off-tune (±35¢)
  // Gray = very off-tune (>35¢)
  const getNoteColorClass = (note: NoteHistoryItem) => {
    switch (note.color) {
      case 'red':
        return 'bg-red-500'; // Wrong note (not selected)
      case 'green':
        return 'bg-green-500'; // Perfect pitch
      case 'yellow':
        return 'bg-yellow-500'; // Slightly off-tune
      case 'gray':
        return 'bg-gray-400'; // Very off-tune
      default:
        return 'bg-gray-400';
    }
  };

  // === CONTINUOUS PITCH DETECTION LOOP ===
  // Runs at 10 updates per second (100ms intervals)
  // Detects pitch, validates frequency range (80-1500 Hz), tracks stability, and updates display
  const detectPitchContinuously = () => {
    if (!analyserRef.current || !audioContextRef.current) return;

    const bufferLength = analyserRef.current.fftSize;
    const buffer = new Float32Array(bufferLength);

    // === STABILITY TRACKING VARIABLES ===
    // These persist across animation frames to track note consistency
    let currentDetectedNote: string | null = null; // Currently tracked swara (e.g., 'S', 'R2')
    let currentDetectedOctave: 'lower' | 'middle' | 'upper' | null = null; // Current octave
    let currentStabilityCounter = 0; // How many consecutive times same note detected
    const STABILITY_THRESHOLD = 4; // Must detect same note 4 times in a row (~0.4 seconds @ 100ms per frame)

    // === UPDATE PITCH FUNCTION ===
    // Processes audio data and updates display
    const updatePitch = () => {
      if (!isAnalyzing || !analyserRef.current || !audioContextRef.current) return;

      // Get audio data from microphone
      analyserRef.current.getFloatTimeDomainData(buffer);

      // Detect fundamental frequency
      const sampleRate = audioContextRef.current.sampleRate;
      const frequency = autoCorrelate(buffer, sampleRate);

      if (frequency !== null && frequency > 0 && frequency >= 80 && frequency <= 1500) {
        // Valid vocal frequency detected (80-1500 Hz range)

        const result = findClosestSwara(frequency, selectedScale);

        if (result) {
          // Check if detected note is in user's selection
          const isCorrect = selectedNotes.size === 0 || selectedNotes.has(result.swara);

          // Update real-time display
          setCurrentNote(result.swara);
          setCurrentNoteName(`${result.frequency.toFixed(1)} Hz`);
          setCurrentCents(result.cents);
          setCurrentIsCorrect(isCorrect);
          setCurrentOctave(result.octave);

          // Check for note stability (for adding to history)
          const detectedSwara = result.swara;
          const detectedOctave = result.octave;

          if (detectedSwara === currentDetectedNote && detectedOctave === currentDetectedOctave) {
            // Same note as before - increment stability counter
            currentStabilityCounter++;

            // Add to history when stable
            if (currentStabilityCounter === STABILITY_THRESHOLD) {
              const now = Date.now();
              setNoteHistory((prev) => {
                // Check if this is a duplicate of the immediately previous note
                const lastNote = prev[prev.length - 1];
                if (lastNote && lastNote.swara === result.swara && lastNote.octave === result.octave) {
                  // Same note being held - don't add duplicate
                  return prev;
                }

                // Determine color based on accuracy and selection
                const selectedSwaras = getSelectedSwaras();
                const hasSelection = selectedSwaras.length > 0;
                const isSelected = !hasSelection || selectedSwaras.includes(result.swara);
                const absCents = Math.abs(result.cents);

                let color: 'red' | 'green' | 'yellow' | 'gray';
                if (!isSelected) {
                  color = 'red'; // Wrong note (not selected)
                } else if (absCents <= 15) {
                  color = 'green'; // Perfect pitch
                } else if (absCents <= 35) {
                  color = 'yellow'; // Slightly off-tune
                } else {
                  color = 'gray'; // Very off-tune
                }

                // Create note object
                const newNote: NoteHistoryItem = {
                  id: nextNoteId.current++,
                  swara: result.swara,
                  frequency: result.frequency,
                  timestamp: now,
                  octave: result.octave,
                  isCorrect,
                  cents: result.cents,
                  color,
                };

                // Keep last 100 notes (prevent memory issues)
                const updated = [...prev, newNote];
                if (updated.length > 100) {
                  updated.shift();
                }

                return updated;
              });

              // Auto-scroll note tracker to show latest note
              setTimeout(() => {
                if (noteTrackerRef.current) {
                  noteTrackerRef.current.scrollLeft = noteTrackerRef.current.scrollWidth;
                }
              }, 50);

              // Reset counter after adding to history to allow continuous tracking
              currentStabilityCounter = 0;
            }
          } else {
            // Different note detected - reset stability tracking
            currentDetectedNote = detectedSwara;
            currentDetectedOctave = detectedOctave;
            currentStabilityCounter = 1;
          }
        }
      } else {
        // No valid pitch detected - clear display
        setCurrentNote('–');
        setCurrentNoteName('');
        setCurrentCents(0);
        setCurrentIsCorrect(false);
        setCurrentOctave('middle');

        // Reset stability
        currentDetectedNote = null;
        currentDetectedOctave = null;
        currentStabilityCounter = 0;
      }

      // Continue loop (10 updates per second)
      animationFrameRef.current = requestAnimationFrame(() => {
        setTimeout(updatePitch, 100);
      });
    };

    // Start the detection loop
    updatePitch();
  };

  // === AUTO-CORRELATION PITCH DETECTION ALGORITHM ===
  // Uses auto-correlation to find the fundamental frequency (pitch) from audio signal
  // This is more accurate than FFT for musical pitch detection
  const autoCorrelate = (buffer: Float32Array, sampleRate: number): number | null => {
    const SIZE = buffer.length;
    const MAX_SAMPLES = Math.floor(SIZE / 2);
    let bestOffset = -1;
    let bestCorrelation = 0;

    // === STEP 1: CALCULATE RMS TO DETECT IF THERE'S SOUND ===
    let rms = 0;
    for (let i = 0; i < SIZE; i++) {
      const val = buffer[i];
      rms += val * val;
    }
    rms = Math.sqrt(rms / SIZE);

    // Silence threshold - ignore very quiet sounds
    if (rms < 0.01) {
      return -1; // No sound detected
    }

    // === STEP 2: FIND BEST AUTOCORRELATION OFFSET ===
    let lastCorrelation = 1;

    for (let offset = 0; offset < MAX_SAMPLES; offset++) {
      let correlation = 0;

      // Compare signal with itself at different time offsets
      for (let i = 0; i < MAX_SAMPLES; i++) {
        correlation += Math.abs(buffer[i] - buffer[i + offset]);
      }

      // Normalize correlation (1 = perfect match, 0 = no match)
      correlation = 1 - (correlation / MAX_SAMPLES);

      // Look for high correlation peaks (>0.9) after a dip
      // This indicates we've found the period of the waveform
      if (correlation > 0.9 && correlation > lastCorrelation) {
        if (correlation > bestCorrelation) {
          bestCorrelation = correlation;
          bestOffset = offset;
        }
      }

      lastCorrelation = correlation;
    }

    // === STEP 3: CALCULATE FREQUENCY IF GOOD CORRELATION FOUND ===
    if (bestCorrelation > 0.01 && bestOffset > 0) {
      return sampleRate / bestOffset;
    }

    return -1; // No pitch detected
  };

  useEffect(() => {
    return () => {
      if (isAnalyzing) {
        stopVocalAnalysis();
      }
    };
  }, []);

  const toggleAnalysis = () => {
    if (!isAnalyzing) {
      startVocalAnalysis();
    } else {
      stopVocalAnalysis();
    }
  };

  const toggleNote = (swara: string) => {
    const newSelected = new Set(selectedNotes);
    if (newSelected.has(swara)) {
      newSelected.delete(swara);
    } else {
      newSelected.add(swara);
    }
    setSelectedNotes(newSelected);
    setSelectedPreset('None');
  };

  const clearSelection = () => {
    setSelectedNotes(new Set());
    setSelectedPreset('None');
  };

  const applyPreset = (presetName: string) => {
    setSelectedPreset(presetName);
    if (presetName === 'None') {
      setSelectedNotes(new Set());
    } else {
      setSelectedNotes(new Set(thaaatPresets[presetName]));
    }
  };

  const togglePlayback = () => {
    if (!isPlaying) {
      // Start playing
      const scale = selectedScale || 'C';
      const audioSrc = tanpuraAudio[scale];

      if (!audioRef.current) {
        audioRef.current = new Audio(audioSrc);
        audioRef.current.loop = true;
        audioRef.current.volume = volume / 100;
      } else {
        audioRef.current.src = audioSrc;
        audioRef.current.volume = volume / 100;
      }

      audioRef.current.play().catch(err => {
        console.error('Error playing audio:', err);
      });
      setIsPlaying(true);
    } else {
      // Stop playing
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setIsPlaying(false);
    }
  };

  // Update volume when slider changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  // Update audio source when scale changes while playing
  useEffect(() => {
    if (isPlaying && audioRef.current) {
      const scale = selectedScale || 'C';
      const audioSrc = tanpuraAudio[scale];
      audioRef.current.src = audioSrc;
      audioRef.current.play().catch(err => {
        console.error('Error playing audio:', err);
      });
    }
  }, [selectedScale, isPlaying]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute -bottom-1/2 -left-1/4 w-96 h-96 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
          <div className="text-center">
            {/* Icon/Logo */}
            <div className="flex justify-center mb-8 animate-float">
              <MusicalNotesWave />
            </div>

            {/* Title */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 mb-6 animate-fade-in">
              Swar Sadhana
            </h1>

            {/* Subtitle */}
            <p className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-orange-800 mb-8 animate-fade-in-delay">
              Indian Classical Pitch Analyzer
            </p>

            {/* Tagline */}
            <p className="text-xl sm:text-2xl text-orange-700 font-medium mb-12 animate-fade-in-delay-2">
              Perfect Your Swaras with Real-Time Vocal Analysis
            </p>

            {/* Description */}
            <div className="max-w-3xl mx-auto mb-12 animate-fade-in-delay-3">
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                Master the art of Indian classical music with precision. Swar Sadhana provides
                real-time pitch analysis to help you perfect your vocal performance and develop
                perfect pitch accuracy in your chosen raga.
              </p>

              {/* Feature Pills */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-orange-200">
                  <div className="flex items-start space-x-4">
                    <div className="bg-gradient-to-br from-orange-500 to-amber-500 p-3 rounded-lg">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">Select Your Scale</h3>
                      <p className="text-sm text-gray-600">Choose your Sa position and set your reference pitch</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-orange-200">
                  <div className="flex items-start space-x-4">
                    <div className="bg-gradient-to-br from-orange-500 to-amber-500 p-3 rounded-lg">
                      <Music2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">Mark Your Swaras</h3>
                      <p className="text-sm text-gray-600">Select specific notes you want to practice and perfect</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-orange-200">
                  <div className="flex items-start space-x-4">
                    <div className="bg-gradient-to-br from-orange-500 to-amber-500 p-3 rounded-lg">
                      <Mic className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">Real-Time Analysis</h3>
                      <p className="text-sm text-gray-600">Analyze your vocals instantly with precise pitch detection</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-orange-200">
                  <div className="flex items-start space-x-4">
                    <div className="bg-gradient-to-br from-orange-500 to-amber-500 p-3 rounded-lg">
                      <Activity className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">Visual Feedback</h3>
                      <p className="text-sm text-gray-600">Perfect your pitch with intuitive visual indicators</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scale Selection Section */}
      <section className="relative py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10 border border-orange-100">
            {/* Heading */}
            <div className="text-center mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3">
                Step 1: Select Your Scale (Sa Position)
              </h2>
              <p className="text-lg text-gray-600">
                Choose the base note that matches your vocal range
              </p>
            </div>

            {/* Selected Scale Display */}
            <div className="text-center mb-8">
              <div className="inline-block bg-gradient-to-r from-orange-50 to-amber-50 px-8 py-4 rounded-xl border-2 border-orange-300">
                <p className="text-sm text-gray-600 mb-1">Currently Selected</p>
                <p className="text-4xl font-bold text-orange-600">{selectedScale}</p>
              </div>
            </div>

            {/* Scale Buttons */}
            <div className="mb-6">
              <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-3 mb-6">
                {scales.map((scale) => (
                  <button
                    key={scale}
                    onClick={() => setSelectedScale(scale)}
                    className={`
                      aspect-square rounded-xl font-bold text-lg sm:text-xl
                      transition-all duration-200 transform hover:scale-105
                      focus:outline-none focus:ring-4 focus:ring-orange-300
                      ${
                        selectedScale === scale
                          ? 'bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-lg scale-105'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 shadow-md'
                      }
                    `}
                  >
                    {scale}
                  </button>
                ))}
              </div>
            </div>

            {/* Helper Text */}
            <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
              <p className="text-sm text-gray-700 text-center">
                <span className="font-semibold text-orange-700">Common ranges:</span>
                {' '}Male voice: C, C#, D • Female voice: G, G#, A
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Player Section */}
      <section className="relative py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl shadow-lg p-6 border border-orange-200">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              {/* Play/Stop Button */}
              <div className="flex items-center gap-4">
                <button
                  onClick={togglePlayback}
                  className={`
                    relative w-20 h-20 rounded-full
                    transition-all duration-300 transform hover:scale-105
                    focus:outline-none focus:ring-4 focus:ring-orange-300
                    ${
                      isPlaying
                        ? 'bg-gradient-to-br from-orange-500 to-amber-600 shadow-2xl animate-pulse-glow'
                        : 'bg-gradient-to-br from-orange-400 to-amber-500 shadow-xl hover:shadow-2xl'
                    }
                  `}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    {isPlaying ? (
                      <Square className="w-9 h-9 text-white fill-white" />
                    ) : (
                      <Play className="w-9 h-9 text-white fill-white ml-1" />
                    )}
                  </div>
                  {isPlaying && (
                    <>
                      <div className="absolute inset-0 rounded-full bg-orange-400 opacity-50 animate-ping"></div>
                      <div className="absolute inset-0 rounded-full bg-orange-300 opacity-30 animate-pulse"></div>
                    </>
                  )}
                </button>
                <div>
                  <p className="text-lg font-semibold text-gray-800">
                    {isPlaying ? 'Tanpura Playing' : 'Tanpura'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {isPlaying ? 'Click to stop' : 'Click to play'}
                  </p>
                </div>
              </div>

              {/* Volume Slider */}
              <div className="w-full sm:w-64 flex items-center gap-3">
                <VolumeX className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:w-4
                    [&::-webkit-slider-thumb]:h-4
                    [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:bg-gradient-to-br
                    [&::-webkit-slider-thumb]:from-orange-500
                    [&::-webkit-slider-thumb]:to-amber-600
                    [&::-webkit-slider-thumb]:shadow-lg
                    [&::-webkit-slider-thumb]:cursor-pointer
                    [&::-webkit-slider-thumb]:transition-transform
                    [&::-webkit-slider-thumb]:hover:scale-110
                    [&::-moz-range-thumb]:w-4
                    [&::-moz-range-thumb]:h-4
                    [&::-moz-range-thumb]:rounded-full
                    [&::-moz-range-thumb]:bg-gradient-to-br
                    [&::-moz-range-thumb]:from-orange-500
                    [&::-moz-range-thumb]:to-amber-600
                    [&::-moz-range-thumb]:border-0
                    [&::-moz-range-thumb]:shadow-lg
                    [&::-moz-range-thumb]:cursor-pointer
                  "
                />
                <Volume2 className="w-4 h-4 text-gray-700 flex-shrink-0" />
                <span className="text-sm text-gray-700 font-medium w-10 text-right">{volume}%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Piano Keyboard Section */}
      <section className="relative py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10 border border-orange-100">
            {/* Heading */}
            <div className="text-center mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3">
                Step 2: Mark the Swaras You Want to Practice
              </h2>
              <p className="text-lg text-gray-600">
                Select notes across all octaves to focus your practice
              </p>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center items-center">
              <div className="flex items-center gap-3">
                <label htmlFor="preset-select" className="text-sm font-semibold text-gray-700 whitespace-nowrap">
                  Quick Select:
                </label>
                <select
                  id="preset-select"
                  value={selectedPreset}
                  onChange={(e) => applyPreset(e.target.value)}
                  className="px-4 py-2 rounded-lg border-2 border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                >
                  {Object.keys(thaaatPresets).map((preset) => (
                    <option key={preset} value={preset}>
                      {preset}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={clearSelection}
                className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-gray-300"
              >
                Clear Selection
              </button>
            </div>

            {/* Piano Keyboard - 3 Octaves */}
            <div className="space-y-8">
              {/* Upper Octave (Taar Saptak) */}
              <div>
                <h3 className="text-center text-sm font-semibold text-gray-600 mb-3">
                  Upper Octave (Taar Saptak) •
                </h3>
                <div className="relative h-40 bg-gradient-to-b from-gray-50 to-gray-100 rounded-lg shadow-inner p-4">
                  <div className="relative h-full flex justify-center">
                    {noteMapping.map((note, idx) => {
                      const isSelected = selectedNotes.has(note.swara);
                      const isCurrentNote = isAnalyzing && currentNote === note.swara && currentOctave === 'upper';
                      const highlightClass = isCurrentNote
                        ? isSelected
                          ? 'shadow-[0_0_20px_rgba(34,197,94,0.8)] !-translate-y-0.5'
                          : 'shadow-[0_0_20px_rgba(239,68,68,0.8)] !-translate-y-0.5'
                        : '';

                      return note.isBlack ? (
                        <button
                          key={`upper-${note.swara}`}
                          onClick={() => toggleNote(note.swara)}
                          className={`absolute h-20 w-12 sm:w-14 rounded-b-lg shadow-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-orange-300 ${
                            isSelected
                              ? 'bg-gradient-to-b from-orange-600 to-orange-800 text-white'
                              : 'bg-gradient-to-b from-gray-700 to-gray-900 text-gray-200 hover:from-gray-600 hover:to-gray-800'
                          } ${highlightClass}`}
                          style={{
                            left: `${idx * 8.33}%`,
                            zIndex: 10,
                          }}
                        >
                          <div className="flex flex-col items-center justify-center h-full">
                            <span className="font-bold text-lg">{note.swara}</span>
                            <div className="w-1 h-1 bg-current rounded-full mt-1 opacity-70"></div>
                          </div>
                        </button>
                      ) : (
                        <button
                          key={`upper-${note.swara}`}
                          onClick={() => toggleNote(note.swara)}
                          className={`h-full flex-1 rounded-lg shadow-md transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-orange-300 border-2 mx-0.5 ${
                            isSelected
                              ? 'bg-gradient-to-b from-orange-100 to-orange-300 border-orange-500 text-orange-900'
                              : 'bg-gradient-to-b from-white to-gray-50 border-gray-300 text-gray-700 hover:from-orange-50 hover:to-orange-100'
                          } ${highlightClass}`}
                          style={{ zIndex: 1 }}
                        >
                          <div className="flex flex-col items-center justify-end h-full pb-3">
                            <span className="font-bold text-xl sm:text-2xl">{note.swara}</span>
                            <div className="w-1 h-1 bg-current rounded-full mt-2 opacity-70"></div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Middle Octave (Madhya Saptak) */}
              <div>
                <h3 className="text-center text-sm font-semibold text-gray-700 mb-3">
                  Middle Octave (Madhya Saptak)
                </h3>
                <div className="relative h-40 bg-gradient-to-b from-gray-50 to-gray-100 rounded-lg shadow-inner p-4">
                  <div className="relative h-full flex justify-center">
                    {noteMapping.map((note, idx) => {
                      const isSelected = selectedNotes.has(note.swara);
                      const isCurrentNote = isAnalyzing && currentNote === note.swara && currentOctave === 'middle';
                      const highlightClass = isCurrentNote
                        ? isSelected
                          ? 'shadow-[0_0_20px_rgba(34,197,94,0.8)] !-translate-y-0.5'
                          : 'shadow-[0_0_20px_rgba(239,68,68,0.8)] !-translate-y-0.5'
                        : '';

                      return note.isBlack ? (
                        <button
                          key={`middle-${note.swara}`}
                          onClick={() => toggleNote(note.swara)}
                          className={`absolute h-20 w-12 sm:w-14 rounded-b-lg shadow-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-orange-300 ${
                            isSelected
                              ? 'bg-gradient-to-b from-orange-600 to-orange-800 text-white'
                              : 'bg-gradient-to-b from-gray-700 to-gray-900 text-gray-200 hover:from-gray-600 hover:to-gray-800'
                          } ${highlightClass}`}
                          style={{
                            left: `${idx * 8.33}%`,
                            zIndex: 10,
                          }}
                        >
                          <div className="flex flex-col items-center justify-center h-full">
                            <span className="font-bold text-lg">{note.swara}</span>
                          </div>
                        </button>
                      ) : (
                        <button
                          key={`middle-${note.swara}`}
                          onClick={() => toggleNote(note.swara)}
                          className={`h-full flex-1 rounded-lg shadow-md transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-orange-300 border-2 mx-0.5 ${
                            isSelected
                              ? 'bg-gradient-to-b from-orange-100 to-orange-300 border-orange-500 text-orange-900'
                              : 'bg-gradient-to-b from-white to-gray-50 border-gray-300 text-gray-700 hover:from-orange-50 hover:to-orange-100'
                          } ${highlightClass}`}
                          style={{ zIndex: 1 }}
                        >
                          <div className="flex flex-col items-center justify-end h-full pb-3">
                            <span className="font-bold text-xl sm:text-2xl">{note.swara}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Lower Octave (Mandra Saptak) */}
              <div>
                <h3 className="text-center text-sm font-semibold text-gray-600 mb-3">
                  Lower Octave (Mandra Saptak) •
                </h3>
                <div className="relative h-40 bg-gradient-to-b from-gray-50 to-gray-100 rounded-lg shadow-inner p-4">
                  <div className="relative h-full flex justify-center">
                    {noteMapping.map((note, idx) => {
                      const isSelected = selectedNotes.has(note.swara);
                      const isCurrentNote = isAnalyzing && currentNote === note.swara && currentOctave === 'lower';
                      const highlightClass = isCurrentNote
                        ? isSelected
                          ? 'shadow-[0_0_20px_rgba(34,197,94,0.8)] !-translate-y-0.5'
                          : 'shadow-[0_0_20px_rgba(239,68,68,0.8)] !-translate-y-0.5'
                        : '';

                      return note.isBlack ? (
                        <button
                          key={`lower-${note.swara}`}
                          onClick={() => toggleNote(note.swara)}
                          className={`absolute h-20 w-12 sm:w-14 rounded-b-lg shadow-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-orange-300 ${
                            isSelected
                              ? 'bg-gradient-to-b from-orange-600 to-orange-800 text-white'
                              : 'bg-gradient-to-b from-gray-700 to-gray-900 text-gray-200 hover:from-gray-600 hover:to-gray-800'
                          } ${highlightClass}`}
                          style={{
                            left: `${idx * 8.33}%`,
                            zIndex: 10,
                          }}
                        >
                          <div className="flex flex-col items-center justify-center h-full">
                            <div className="w-1 h-1 bg-current rounded-full mb-1 opacity-70"></div>
                            <span className="font-bold text-lg">{note.swara}</span>
                          </div>
                        </button>
                      ) : (
                        <button
                          key={`lower-${note.swara}`}
                          onClick={() => toggleNote(note.swara)}
                          className={`h-full flex-1 rounded-lg shadow-md transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-orange-300 border-2 mx-0.5 ${
                            isSelected
                              ? 'bg-gradient-to-b from-orange-100 to-orange-300 border-orange-500 text-orange-900'
                              : 'bg-gradient-to-b from-white to-gray-50 border-gray-300 text-gray-700 hover:from-orange-50 hover:to-orange-100'
                          } ${highlightClass}`}
                          style={{ zIndex: 1 }}
                        >
                          <div className="flex flex-col items-center justify-end h-full pb-3">
                            <div className="w-1 h-1 bg-current rounded-full mb-2 opacity-70"></div>
                            <span className="font-bold text-xl sm:text-2xl">{note.swara}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="mt-8 flex flex-wrap gap-6 justify-center text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gradient-to-b from-white to-gray-50 border-2 border-gray-300 rounded"></div>
                <span>Natural (Shuddha) Notes</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gradient-to-b from-gray-700 to-gray-900 rounded"></div>
                <span>Komal/Tivra Notes</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">• Above:</span>
                <span>Upper Octave</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">• Below:</span>
                <span>Lower Octave</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vocal Analysis Section */}
      <section className="relative py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10 border border-orange-100">
            {/* Heading */}
            <div className="text-center mb-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3">
                Step 3: Analyze Your Vocals
              </h2>
              <p className="text-lg text-gray-600">
                Sing along with the tanpura and watch your swaras appear in real-time
              </p>
            </div>

            {/* Main Control Button */}
            <div className="flex justify-center mb-8">
              <button
                onClick={toggleAnalysis}
                className={`
                  w-full sm:w-auto sm:min-w-[400px] h-16
                  rounded-xl font-bold text-xl
                  transition-all duration-300 transform hover:scale-105
                  focus:outline-none focus:ring-4 focus:ring-offset-2
                  shadow-lg hover:shadow-xl
                  ${
                    isAnalyzing
                      ? 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-300 animate-pulse-subtle'
                      : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white focus:ring-orange-300'
                  }
                `}
              >
                {isAnalyzing ? (
                  <span className="flex items-center justify-center gap-3">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                    </span>
                    Stop Analysis
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-3">
                    <Mic className="w-6 h-6" />
                    Start Live Vocal Analysis
                  </span>
                )}
              </button>
            </div>

            {/* Real-Time Current Note Display */}
            {isAnalyzing && (
              <div className="mt-8 bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-2 font-medium">Currently Singing:</div>
                  <div className="relative inline-block text-6xl font-extrabold text-orange-600 leading-none my-3">
                    {currentNote}
                    {/* Octave indicator - dot above for upper octave */}
                    {currentOctave === 'upper' && currentNote !== '–' && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-2.5 h-2.5 bg-orange-600 rounded-full"></div>
                    )}
                    {/* Octave indicator - dot below for lower octave */}
                    {currentOctave === 'lower' && currentNote !== '–' && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2.5 h-2.5 bg-orange-600 rounded-full"></div>
                    )}
                  </div>
                  <div className="text-lg text-gray-600 mb-6 min-h-[28px]">
                    {currentNoteName && `(${getSwaraName(currentNote)}) • ${currentNoteName}`}
                  </div>

                  {/* Pitch Accuracy Meter */}
                  <div className="mt-6">
                    <div className="text-sm text-gray-600 mb-3 font-medium">Pitch Accuracy:</div>
                    <div className="w-full max-w-md mx-auto">
                      <div className="relative w-full h-10 rounded-full overflow-visible shadow-inner"
                        style={{
                          background: 'linear-gradient(to right, #ef4444 0%, #eab308 25%, #22c55e 45%, #22c55e 55%, #eab308 75%, #ef4444 100%)'
                        }}
                      >
                        {/* Center line */}
                        <div className="absolute left-1/2 top-0 w-0.5 h-full bg-gray-900 transform -translate-x-1/2 z-10"></div>

                        {/* Moving indicator */}
                        <div
                          className="absolute top-1/2 w-2 h-12 bg-gray-900 rounded transform -translate-y-1/2 transition-all duration-100 ease-out shadow-lg z-20"
                          style={{
                            left: `${50 + (currentCents / 50) * 50}%`,
                            transform: `translate(-50%, -50%)`
                          }}
                        ></div>
                      </div>
                    </div>
                    <div
                      className="mt-3 text-base font-semibold transition-colors duration-200"
                      style={{
                        color: Math.abs(currentCents) <= 10
                          ? '#22c55e' // green for perfect
                          : Math.abs(currentCents) <= 25
                          ? '#eab308' // yellow for slightly off
                          : '#ef4444' // red for very off
                      }}
                    >
                      {currentCents > 0 ? '+' : ''}{currentCents.toFixed(0)}¢
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Note History Tracker */}
            {isAnalyzing && (
              <div className="mt-6 bg-white rounded-xl shadow-md p-6 border border-gray-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Your Practice Session:</h3>

                <div
                  ref={noteTrackerRef}
                  className="w-full min-h-[90px] max-h-[90px] overflow-x-auto overflow-y-hidden whitespace-nowrap p-5 bg-gray-50 border-2 border-gray-200 rounded-xl flex items-center gap-1.5 scroll-smooth
                    [&::-webkit-scrollbar]:h-2
                    [&::-webkit-scrollbar-track]:bg-gray-100
                    [&::-webkit-scrollbar-track]:rounded
                    [&::-webkit-scrollbar-thumb]:bg-gray-300
                    [&::-webkit-scrollbar-thumb]:rounded
                    [&::-webkit-scrollbar-thumb:hover]:bg-gray-400"
                >
                  {noteHistory.length === 0 ? (
                    <p className="text-gray-500 text-center w-full">
                      Your sung notes will appear here...
                    </p>
                  ) : (
                    noteHistory.map((note) => (
                      <div
                        key={note.id}
                        className={`relative inline-flex flex-col items-center justify-center px-3.5 py-2 text-white rounded-xl shadow-md min-w-[50px] h-[50px] shrink-0 transform transition-all hover:-translate-y-0.5 hover:shadow-lg ${getNoteColorClass(note)}`}
                      >
                        {/* Octave indicator - dot above for upper octave */}
                        {note.octave === 'upper' && (
                          <div className="absolute top-1 w-1.5 h-1.5 bg-white rounded-full opacity-90"></div>
                        )}

                        {/* Octave indicator - dot below for lower octave */}
                        {note.octave === 'lower' && (
                          <div className="absolute bottom-1 w-1.5 h-1.5 bg-white rounded-full opacity-90"></div>
                        )}

                        <span className="text-xl font-bold leading-tight">{note.swara}</span>
                      </div>
                    ))
                  )}
                </div>

                {/* Color Legend */}
                <div className="mt-5 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="font-semibold text-yellow-900 mb-3 text-sm">Color Guide:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="flex items-center gap-2 text-sm text-yellow-900">
                      <span className="w-6 h-6 bg-green-500 rounded flex-shrink-0"></span>
                      <span>Perfect (correct note, accurate pitch)</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-yellow-900">
                      <span className="w-6 h-6 bg-yellow-500 rounded flex-shrink-0"></span>
                      <span>Slightly off-tune (correct note, needs adjustment)</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-yellow-900">
                      <span className="w-6 h-6 bg-red-500 rounded flex-shrink-0"></span>
                      <span>Wrong note (not in your selection)</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-yellow-900">
                      <span className="w-6 h-6 bg-gray-400 rounded flex-shrink-0"></span>
                      <span>Very off-tune (correct note, major adjustment needed)</span>
                    </div>
                  </div>
                </div>

                {/* Clear History Button */}
                <div className="mt-5 flex justify-center">
                  <button
                    onClick={clearNoteHistory}
                    className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  >
                    Clear History
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
