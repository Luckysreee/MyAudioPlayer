import React, { useState, useEffect } from 'react';
import AudioPlayer from './components/AudioPlayer';
import Playlist from './components/Playlist';
import LanguageSelector from './components/LanguageSelector';
import AccessibilityToggle from './components/AccessibilityToggle';
import './styles/base.css';
import './styles/accessibility.css';

import en from './i18n/en.json';
import es from './i18n/es.json';
import fr from './i18n/fr.json';
import sw from './i18n/sw.json';

const translations = { en, es, fr, sw };

function App() {
    const [files, setFiles] = useState([]);
    const [currentFileIndex, setCurrentFileIndex] = useState(-1);
    const [language, setLanguage] = useState('en');
    const [isHighContrast, setIsHighContrast] = useState(false);

    const t = translations[language];

    useEffect(() => {
        if (isHighContrast) {
            document.body.classList.add('accessibility-mode');
        } else {
            document.body.classList.remove('accessibility-mode');
        }
    }, [isHighContrast]);

    const handleFileSelect = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles((prev) => [...prev, ...selectedFiles]);
        if (currentFileIndex === -1 && selectedFiles.length > 0) {
            setCurrentFileIndex(0); // Start playing the first new file if list was empty
        }
    };

    const playFile = (index) => {
        if (index >= 0 && index < files.length) {
            setCurrentFileIndex(index);
        }
    };

    const nextTrack = () => {
        if (currentFileIndex < files.length - 1) {
            setCurrentFileIndex(currentFileIndex + 1);
        } else {
            // Loop back to start or stop? Let's stop or loop. Loop is friendlier?
            // Requirement says "Auto-play next track". Usually implies stop at end.
            // Let's loop for continuous listening pleasure if it's the only option, but simply stopping is safer.
            // We'll just stop if it's the last track.
        }
    };

    const prevTrack = () => {
        if (currentFileIndex > 0) {
            setCurrentFileIndex(currentFileIndex - 1);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.target.classList.add('dragging');
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.target.classList.remove('dragging');
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.target.classList.remove('dragging');
        const droppedFiles = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('audio/'));
        if (droppedFiles.length > 0) {
            setFiles(prev => {
                const newFiles = [...prev, ...droppedFiles];
                if (currentFileIndex === -1) setCurrentFileIndex(prev.length); // Start playing first of dropped
                return newFiles;
            });
        }
    };

    return (
        <div className="app-container">
            <header>
                <h1>{t.title}</h1>
                <div className="controls-top">
                    <LanguageSelector currentLang={language} onLanguageChange={setLanguage} />
                    <AccessibilityToggle
                        isHighContrast={isHighContrast}
                        toggleHighContrast={() => setIsHighContrast(!isHighContrast)}
                        label={t.accessibilityMode}
                    />
                </div>
            </header>

            <main>
                <div
                    className="drop-zone"
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('file-input').click()}
                >
                    <p>{t.dragDropText}</p>
                    <input
                        id="file-input"
                        type="file"
                        multiple
                        accept="audio/*"
                        onChange={handleFileSelect}
                        style={{ display: 'none' }}
                    />
                </div>

                <AudioPlayer
                    currentFile={files[currentFileIndex]}
                    onEnded={nextTrack}
                    onNext={nextTrack}
                    onPrev={prevTrack}
                    translations={t}
                />

                <Playlist
                    files={files}
                    currentFileIndex={currentFileIndex}
                    onPlay={playFile}
                    onReorder={setFiles}
                    translations={t}
                />
            </main>
        </div>
    );
}

export default App;
