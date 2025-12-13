# MyAudioPlayer (Hybrid Audio Studio)

A hybrid web-based audio application that combines traditional audio file playback with a real-time synthesizer and a stave-based melody input system. The project emphasizes accessibility, multilingual usability, and modular design, and was developed entirely through AI-assisted vibe coding.

---

## Index

* [Overview](#overview)
* [Features](#features)

  * [Hybrid Audio Engine](#hybrid-audio-engine)
  * [Stave Input System](#stave-input-system)
  * [Playlist Management](#playlist-management)
  * [Multilingual Support](#multilingual-support)
  * [Accessibility and Customization](#accessibility-and-customization)
* [Project Structure](#project-structure)
* [Installation and Setup](#installation-and-setup)

  * [Local Environment](#local-environment)
  * [GitHub Codespaces](#github-codespaces)
* [Usage](#usage)

  * [Audio Player Mode](#audio-player-mode)
  * [Synthesizer Mode](#synthesizer-mode)
  * [Stave Input Mode](#stave-input-mode)
* [Technologies Used](#technologies-used)

---

## Overview

MyAudioPlayer is a hybrid audio application built with React, Vite, and the Web Audio API. It integrates three core capabilities: playback of local audio files, real-time sound synthesis, and algorithmic melody playback through a stave-style input system. The application is designed to be fully accessible, responsive, and multilingual.

---

## Features

### Hybrid Audio Engine

* Audio Player Mode supports playback of local audio files, including play, pause, replay, seeking, and volume adjustment.
* Synthesizer Mode generates sound using Web Audio API oscillators with selectable waveforms, frequency control, and noise generation.
* A shared waveform visualizer displays real-time audio output from all modes, including player, synthesizer, stave playback, and noise sources.

### Stave Input System

The application includes a stave-inspired melody input feature that allows users to play music without requiring music theory knowledge.

Two input methods are supported:

* Text Input Mode: Users enter notes line by line using a simple format (note, octave, duration). The system validates input and highlights errors.
* Builder Input Mode: Users construct melodies using dropdown controls for note, accidental, octave, and duration, adding notes incrementally to a melody table.

Both modes operate on the same internal melody representation and can be switched at any time.

### Playlist Management

* Drag-and-drop upload of audio files.
* Reordering of playlist items.
* Deletion of individual tracks or clearing the entire playlist.
* Automatic playback of the next track when the current one ends.

### Multilingual Support

The entire interface is available in four languages:

* English
* Spanish
* French
* Swahili

Language switching is instant and applies across all UI components.

### Accessibility and Customization

* High-contrast accessibility mode for improved visibility.
* Adjustable text scaling from 80 percent to 200 percent.
* Light and dark theme support.
* ARIA labels and keyboard-friendly controls throughout the application.

---

## Project Structure

```
/
├── package.json
├── vite.config.js
├── index.html
├── README.md
└── src
    ├── main.jsx
    ├── App.jsx
    ├── components
    │   ├── AudioPlayer.jsx
    │   ├── Playlist.jsx
    │   ├── Visualizer.jsx
    │   ├── SynthControls.jsx
    │   ├── StaveInput.jsx
    │   ├── LanguageSelector.jsx
    │   ├── AccessibilityToggle.jsx
    │   └── Icons.jsx
    ├── i18n
    │   ├── en.json
    │   ├── es.json
    │   ├── fr.json
    │   └── sw.json
    └── styles
        ├── base.css
        └── accessibility.css
```
---

## Installation and Setup

### Local Environment

```bash
# clone the repository
git clone https://github.com/Luckysreee/MyAudioPlayer.git

# move into the project directory
cd MyAudioPlayer

# install dependencies
npm install

# start the development server
npm run dev
```

The Vite development server URL will be displayed in the terminal.

### GitHub Codespaces

```bash
# inside the codespace terminal
npm install
npm run dev
```

No additional configuration is required for Codespaces.

4. Open the development server URL shown in the terminal.

### GitHub Codespaces

1. Push the project to a GitHub repository.
2. Open the repository on GitHub.
3. Select Code, then Codespaces, and create a codespace on the main branch.
4. In the codespace terminal, run:

   npm install
   npm run dev

---

## Usage

### Audio Player Mode

Upload audio files to the playlist and control playback using the provided controls. The waveform visualizer activates whenever audio is playing.

### Synthesizer Mode

Select a waveform or noise type and adjust parameters such as frequency and volume to generate sound in real time. The visualizer responds to the generated signal.

### Stave Input Mode

Create and play melodies using either text-based note input or the graphical builder interface. Notes are scheduled using the Web Audio API and played back through the shared audio engine.

---

## Technologies Used

* React
* Vite
* Web Audio API
* Plain CSS with CSS variables for theming and accessibility

---

*This project was vibe-coded using Google Antigravity.*
