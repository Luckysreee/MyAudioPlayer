# MyAudioPlayer (Hybrid Audio Studio)

A hybrid web-based audio application that combines traditional audio file playback with a real-time synthesizer. This project is built for accessibility, multilingual usability, and ease of extension.

## Features

### Hybrid Audio Engine

* Audio Player Mode supports standard playback of local audio files, including play, pause, stop, seeking, and volume adjustment.
* Synthesizer Mode generates tones using the Web Audio API oscillator with selectable waveforms and adjustable frequency.
* A unified waveform visualizer displays real-time audio output from both the audio player and synthesizer.

### Playlist Management

* Drag and drop files to build a playlist.
* Reorder tracks, remove individual entries, or clear the entire playlist.
* Automatic progression to the next track when a file finishes playing.

### Multilingual Support

The interface includes four languages:

* English
* Spanish
* French
* Swahili

Language switching is immediate and applies across all interface elements.

### Accessibility and Customization

* High-contrast accessibility mode for improved visibility.
* Adjustable text scaling from 80 percent to 200 percent.
* Light and dark theme options.

## Project Structure

```
/
  package.json
  vite.config.js
  index.html
  /src
    main.jsx
    App.jsx
    /components
      AudioPlayer.jsx
      Playlist.jsx
      Visualizer.jsx
      LanguageSelector.jsx
      AccessibilityToggle.jsx
    /i18n
      en.json
      es.json
      fr.json
      sw.json
    /styles
      base.css
      accessibility.css
```

## Installation and Setup

### Local Environment

1. Install Node.js LTS.
2. Navigate to the project directory.
3. Run the following commands:

```
npm install
npm run dev
```

The development server URL will appear in the terminal.

### GitHub Codespaces

1. Push the project to a GitHub repository.
2. Open the repository on GitHub.
3. Select Code, then choose Codespaces, and create a codespace on the main branch.
4. Inside the codespace terminal, run:

```
npm install
npm run dev
```

## Technologies Used

* React
* Vite
* Web Audio API
* CSS variables for dynamic theming

## Usage

### Audio Player Mode

Load audio files into the playlist, then use the playback controls. The visualizer activates whenever audio is playing.

### Synthesizer Mode

Select the waveform type and adjust the frequency to generate tones. Control output volume directly in the interface. The visualizer responds to the generated signal.

### Accessibility and Languages

Language, theme, contrast, and zoom controls are available directly in the interface header.

---

* vibe-coded using google antigravity
