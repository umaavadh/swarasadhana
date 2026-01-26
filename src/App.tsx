import { Music2, Mic, Target, Activity } from 'lucide-react';
import { useState } from 'react';

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

function App() {
  const [selectedScale, setSelectedScale] = useState('C');
  const [selectedNotes, setSelectedNotes] = useState<Set<string>>(new Set());
  const [selectedPreset, setSelectedPreset] = useState('None');
  const scales = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

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
                      return note.isBlack ? (
                        <button
                          key={`upper-${note.swara}`}
                          onClick={() => toggleNote(note.swara)}
                          className={`absolute h-20 w-12 sm:w-14 rounded-b-lg shadow-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-orange-300 ${
                            isSelected
                              ? 'bg-gradient-to-b from-orange-600 to-orange-800 text-white'
                              : 'bg-gradient-to-b from-gray-700 to-gray-900 text-gray-200 hover:from-gray-600 hover:to-gray-800'
                          }`}
                          style={{
                            left: `${idx * 8.33}%`,
                            zIndex: 10,
                          }}
                        >
                          <div className="flex flex-col items-center justify-center h-full">
                            <span className="text-xs opacity-70">{note.western}</span>
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
                          }`}
                          style={{ zIndex: 1 }}
                        >
                          <div className="flex flex-col items-center justify-end h-full pb-3">
                            <span className="text-xs opacity-70 mb-1">{note.western}</span>
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
                      return note.isBlack ? (
                        <button
                          key={`middle-${note.swara}`}
                          onClick={() => toggleNote(note.swara)}
                          className={`absolute h-20 w-12 sm:w-14 rounded-b-lg shadow-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-orange-300 ${
                            isSelected
                              ? 'bg-gradient-to-b from-orange-600 to-orange-800 text-white'
                              : 'bg-gradient-to-b from-gray-700 to-gray-900 text-gray-200 hover:from-gray-600 hover:to-gray-800'
                          }`}
                          style={{
                            left: `${idx * 8.33}%`,
                            zIndex: 10,
                          }}
                        >
                          <div className="flex flex-col items-center justify-center h-full">
                            <span className="text-xs opacity-70">{note.western}</span>
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
                          }`}
                          style={{ zIndex: 1 }}
                        >
                          <div className="flex flex-col items-center justify-end h-full pb-3">
                            <span className="text-xs opacity-70 mb-1">{note.western}</span>
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
                      return note.isBlack ? (
                        <button
                          key={`lower-${note.swara}`}
                          onClick={() => toggleNote(note.swara)}
                          className={`absolute h-20 w-12 sm:w-14 rounded-b-lg shadow-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-orange-300 ${
                            isSelected
                              ? 'bg-gradient-to-b from-orange-600 to-orange-800 text-white'
                              : 'bg-gradient-to-b from-gray-700 to-gray-900 text-gray-200 hover:from-gray-600 hover:to-gray-800'
                          }`}
                          style={{
                            left: `${idx * 8.33}%`,
                            zIndex: 10,
                          }}
                        >
                          <div className="flex flex-col items-center justify-center h-full">
                            <div className="w-1 h-1 bg-current rounded-full mb-1 opacity-70"></div>
                            <span className="text-xs opacity-70">{note.western}</span>
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
                          }`}
                          style={{ zIndex: 1 }}
                        >
                          <div className="flex flex-col items-center justify-end h-full pb-3">
                            <div className="w-1 h-1 bg-current rounded-full mb-2 opacity-70"></div>
                            <span className="text-xs opacity-70 mb-1">{note.western}</span>
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
    </div>
  );
}

export default App;
