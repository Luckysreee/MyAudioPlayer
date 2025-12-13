# Audio Studio (Hybrid Audio Workstation)

A comprehensive web-based audio studio that combines file playback, real-time synthesis, and melody composition. Built with React and the Web Audio API, it features a completely modular, draggable interface designed for accessibility and creativity.

## Table of Contents

- [Features](#features)
- [Screenshots](#screenshots)
- [Installation and Setup](#installation-and-setup)
- [Usage](#usage)
  - [Audio Player](#audio-player)
  - [Synthesizer](#synthesizer)
  - [Stave Input](#stave-input-melody-creator)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)

---

## Features

### 🎛️ Modular Draggable Interface
* **Customizable Layout**: All main components (Player, Visualizer, Controls, Playlist, Stave) are draggable cards. Organize your workspace exactly how you like it.
* **Layout Reset**: Quickly restore the default layout with a single click.
* **Responsive Design**: Adapts to different screen sizes with a clean, grid-based architecture.

### 1. Audio Player Mode
* **Complete Playback Control**: Play, pause, stop, seek, and **Loop** tracks.
* **Smart Playlist**: Drag and drop files to upload. Reorder tracks, remove items, and clear the list.
* **Auto-Advance**: The player automatically advances to the next track or stops at the end of the playlist.
* **Loop Mode**: Seamlessly repeat your favorite tracks.

### 2. Synthesizer Mode
* **Real-time Generation**: Generate tones using standard waveforms (Sine, Square, Sawtooth, Triangle) and Noise types (White, Pink).
* **Interactive Visuals**: Includes 3D-style canvas animations (Ground, Bridge) that react to the synth's state.
* **Frequency Control**: Fine-tune the oscillator frequency for precise sound design.

### 3. Stave Input Mode (Melody Creator)
* **Visual Composition**: Create melodies by adding notes to a virtual stave.
* **Multiple Input Methods**:
    * **Piano**: Click keys on a virtual piano (supports full octaves).
    * **Builder**: Select notes and durations from dropdowns.
    * **Text**: Input notes using text format (e.g., `C4 0.5`).
* **Melody Table**: Reorder, edit, and delete notes in a structured table view.
* **Playback**: Listen to your composition synthesized instantly.

### Multilingual Support
The interface supports four languages with instant switching:
* **English**
* **Spanish** (Español)
* **French** (Français)
* **Swahili** (Kiswahili)

### Accessibility and Theming
* **High-Contrast Mode**: Enhanced visibility for accessibility.
* **Zoom Controls**: Adjust interface scaling from 50% to 150%.
* **Theme Support**: Switch between Dark (Default) and Light themes.

---

## Screenshots

*(Placeholder for Screenshots)*

> **Note**: This application is a visual experience. We recommend running it locally to see the real-time visualizations and animations.

---

## Installation and Setup

### Local Environment

1. **Prerequisites**: Ensure you have [Node.js](https://nodejs.org/) installed.
2. **Clone the repository**:
   ```bash
   git clone https://github.com/Luckysreee/MyAudioPlayer.git
   cd MyAudioPlayer
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Run the development server**:
   ```bash
   npm run dev
   ```
5. **Open**: The terminal will show a local URL (usually `http://localhost:5173`). Open this in your browser.

### GitHub Codespaces

1. Open the repository on GitHub.
2. Select **Code** > **Codespaces** > **Create codespace on main**.
3. In the terminal: `npm install && npm run dev`.

---

## Usage

### Navigation
Use the header tabs to switch between **Audio Player** (Playback), **Synthesizer** (Tone Generation), and **Stave Input** (Composition) modes. Use the refresh icon (↺) to reset the draggable layout if cards get disorganized.

### Audio Player
1.  **Upload**: Drag audio files onto the upload card area or click to browse files.
2.  **Playlist**: Click a track to play. Use the Up/Down arrows to reorder tracks.
3.  **Controls**: Use the main player card to Play, Pause, Toggle Loop, or adjust Volume.

### Synthesizer
1.  **Generate**: Click "Start" to hear the tone.
2.  **Modify**: Change the waveform (Sine, Square, Noise, etc.) and use the slider to adjust frequency.
3.  **Visuals**: Watch the canvas animations (Bridge/Ground) react to your sound.

### Stave Input (Melody Creator)
1.  **Compose**: Choose an input mode (Piano, Builder, or Text).
2.  **Add Notes**:
    *   **Piano**: Set Duration/Octave and click keys.
    *   **Text**: Type notes like `C4 0.5` (Note+Octave Duration) and click "Add".
3.  **Edit**: Use the Melody Table to reorder or delete notes.
4.  **Play**: Click "Play Melody" to hear your composition synthesized.

---

## Project Structure

```
/
  package.json
  vite.config.js
  index.html
  /src
    main.jsx
    App.jsx               # Main Layout & State Manager
    /components
      AudioPlayer.jsx     # Core Logic & Draggable Container
      DraggableCard.jsx   # UI wrapper for draggable elements
      StaveInput.jsx      # Melody Editor
      Piano.jsx           # Virtual Piano
      Visualizer.jsx      # Audio Visualizer (Canvas)
      Playlist.jsx        # Playlist Logic
      SynthControls.jsx   # Synth UI
      SynthAnimation.jsx  # 3D Canvas Animations
      Footer.jsx
    /i18n                 # Localization Files
      en.json
      es.json
      fr.json
      sw.json
    /styles
      base.css            # Core Styles
      accessibility.css   # High Contrast Overrides
```

---

## Technologies Used

* **React**: UI Component Library
* **Vite**: Build Tool
* **Web Audio API**: Audio Synthesis and Analysis
* **CSS Variables**: Dynamic Theming and Responsiveness

---

## Contributing

Contributions are welcome!
1. Fork the project.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

*vibe-coded using google antigravity*
