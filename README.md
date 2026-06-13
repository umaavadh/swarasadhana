# Swar Sadhana — Indian Classical Pitch Analyzer

A browser-based tool for practicing Indian classical vocal music. It provides a tanpura drone, an interactive swara keyboard, and real-time microphone pitch analysis to help singers develop accurate intonation in any scale.

---

## Features

### Step 1 — Scale Selection (Sa Position)
Choose from all 12 chromatic pitches (C through B) as your tonic. The selected note becomes Sa, and all swara frequencies are recalculated relative to it. Typical ranges: male voice C–D, female voice G–A.

### Step 2 — Swara Selection
An interactive three-octave piano keyboard displays all 12 swaras mapped to their Indian classical names:

| Western | Swara | Name |
|---------|-------|------|
| C | S | Shadja |
| C# | R1 | Komal Rishabh |
| D | R2 | Shuddh Rishabh |
| D# | G1 | Komal Gandhar |
| G | G2 | Shuddh Gandhar |
| F | M1 | Shuddh Madhyam |
| F# | M2 | Tivra Madhyam |
| G | P | Pancham |
| G# | D1 | Komal Dhaivat |
| A | D2 | Shuddh Dhaivat |
| A# | N1 | Komal Nishad |
| B | N2 | Shuddh Nishad |

Octaves are labeled Mandra (lower •), Madhya (middle), and Taar (upper •) saptak, with dot indicators matching traditional notation convention.

**Thaat presets** let you instantly select all swaras of a thaat: Bilawal, Kafi, Bhairav, Kalyan, Khamaj, Asavari, Bhairavi.

### Tanpura Player
Plays pre-recorded tanpura audio for the selected scale (all 12 chromatic notes available as MP3 files). The audio loops continuously with an adjustable volume slider. Changing the scale while playing seamlessly switches to the correct audio file.

### Step 3 — Live Vocal Analysis
Captures microphone input via the Web Audio API and detects the fundamental pitch using an autocorrelation algorithm every 100 ms. Valid vocal range: 80–1500 Hz.

**Real-time display:**
- Current swara name and full Indian name (e.g. S — Shadja)
- Detected frequency in Hz
- Pitch accuracy meter showing deviation in cents (±50¢ range)
- Color-coded indicator: green ≤10¢, yellow ≤25¢, red >25¢

**Note history tracker:** A horizontal scrolling strip records each note held for ~400 ms (4 consecutive matching detections). Color coding:
- Green — correct note, accurate pitch (≤15¢)
- Yellow — correct note, slightly off-tune (≤35¢)
- Gray — correct note, major deviation (>35¢)
- Red — note not in the current selection

---

## Project Structure

```
src/
  App.tsx        — Main component: all UI, state, audio playback, pitch detection
  pitchUtils.ts  — Frequency calculation and pitch-matching utilities
  index.css      — Custom Tailwind animations (blob, float, fade-in, pulse-glow)
  main.tsx       — React entry point

public/audio/    — Pre-recorded tanpura MP3s for all 12 chromatic pitches
```

### `pitchUtils.ts`

| Export | Description |
|--------|-------------|
| `calculateFrequencies(scale)` | Returns all 36 swara frequencies (3 octaves) for a given Sa |
| `findClosestSwara(frequency, scale)` | Maps a detected Hz value to the nearest swara with cents deviation and octave label |
| `SwaraFrequency` | Type: swara name, frequency, octave label, semitone offset |
| `ClosestSwaraMatch` | Type: matched swara, octave, cents error, detected and target frequencies |

### Pitch Detection Algorithm (`autoCorrelate`)
Implements time-domain autocorrelation on a 2048-sample buffer. Detects the period of the waveform by finding the lag offset with the highest normalized correlation (threshold > 0.9). Returns the fundamental frequency as `sampleRate / bestOffset`. Silence is gated at RMS < 0.01.

---

## Tech Stack

| Technology | Role |
|------------|------|
| React 18 + TypeScript | UI framework |
| Vite 5 | Build tool and dev server |
| Tailwind CSS 3 | Styling |
| Lucide React | Icons |
| Web Audio API | Microphone capture and signal processing |
| HTML5 Audio | Tanpura playback |

---

## Getting Started

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173`. Microphone access is requested by the browser when you start vocal analysis.

### Build

```bash
npm run build
```

### Type Check

```bash
npm run typecheck
```
