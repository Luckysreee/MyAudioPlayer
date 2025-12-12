import React, { useState, useEffect } from 'react';
import AudioPlayer from './components/AudioPlayer';
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

    // Lifted State
    const [mode, setMode] = useState('player'); // 'player' | 'synth' | 'stave'

    const t = translations[language];

    useEffect(() => {
        if (isHighContrast) {
            document.body.classList.add('accessibility-mode');
        } else {
            document.body.classList.remove('accessibility-mode');
        }
    }, [isHighContrast]);

    // File Handling
    const handleFileSelect = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles((prev) => [...prev, ...selectedFiles]);
        if (currentFileIndex === -1 && selectedFiles.length > 0) {
            setCurrentFileIndex(0);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.target.classList.remove('dragging');

        const allFiles = Array.from(e.dataTransfer.files);
        const audioFiles = allFiles.filter(f => f.type.startsWith('audio/'));

        if (allFiles.length !== audioFiles.length) {
            alert("Some files were rejected because they are not audio files.");
        }

        if (audioFiles.length > 0) {
            setFiles(prev => {
                const newFiles = [...prev, ...audioFiles];
                if (currentFileIndex === -1) setCurrentFileIndex(prev.length);
                return newFiles;
            });
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
        }
    };

    const prevTrack = () => {
        if (currentFileIndex > 0) {
            setCurrentFileIndex(currentFileIndex - 1);
        }
    };

    const handleDelete = (index) => {
        setFiles(prev => {
            const newFiles = [...prev];
            newFiles.splice(index, 1);
            return newFiles;
        });

        // Loop logic fix
        if (index === currentFileIndex) {
            setCurrentFileIndex(-1);
        } else if (index < currentFileIndex) {
            setCurrentFileIndex(currentFileIndex - 1);
        }
    };

    const handleClearAll = () => {
        setFiles([]);
        setCurrentFileIndex(-1);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.target.classList.add('dragging');
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.target.classList.remove('dragging');
    };

    return (
        <div className="app-container">
            <header className="flex-between mb-4">
                <h1>{t.title}</h1>
                <div className="flex-center gap-md">
                    <LanguageSelector currentLang={language} onLanguageChange={setLanguage} />
                    <AccessibilityToggle
                        isHighContrast={isHighContrast}
                        toggleHighContrast={() => setIsHighContrast(!isHighContrast)}
                        label={t.accessibilityMode}
                    />
                </div>
            </header>

            {/* TAB BAR NAVIGATION */}
            <nav className="tab-bar">
                <button
                    className={`tab-btn ${mode === 'player' ? 'active' : ''}`}
                    onClick={() => setMode('player')}
                >
                    {t.player}
                </button>
                <button
                    className={`tab-btn ${mode === 'synth' ? 'active' : ''}`}
                    onClick={() => setMode('synth')}
                >
                    {t.synthesizer}
                </button>
                <button
                    className={`tab-btn ${mode === 'stave' ? 'active' : ''}`}
                    onClick={() => setMode('stave')}
                >
                    {t.staveInput}
                </button>
            </nav>

            <main>
                {/* Drag Drop only relevant for Player mode? Or always available? 
                    Design says "Playlist card". Let's put DropZone inside Player Tab implicitly 
                    via AudioPlayer component or here. Let's pass it down or keep it here 
                    but only show in player mode to reduce clutter. */}

                {mode === 'player' && (
                    <div
                        className="drop-zone card"
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => document.getElementById('file-input').click()}
                        style={{ textAlign: 'center', padding: '3rem', cursor: 'pointer', borderStyle: 'dashed' }}
                    >
                        <p style={{ pointerEvents: 'none' }}>{t.dragDropText}</p>
                        <input
                            id="file-input"
                            type="file"
                            multiple
                            accept="audio/*"
                            onChange={handleFileSelect}
                            style={{ display: 'none' }}
                        />
                    </div>
                )}

                <AudioPlayer
                    mode={mode} // Pass mode
                    setMode={setMode} // Allow internal switches if needed (though we use tabs now)
                    currentFile={currentFileIndex !== -1 ? files[currentFileIndex] : null}
                    onEnded={nextTrack}
                    onNext={nextTrack}
                    onPrev={prevTrack}
                    translations={t}
                    // Playlist props
                    files={files}
                    currentFileIndex={currentFileIndex}
                    playFile={playFile}
                    handleDelete={handleDelete}
                    handleClearAll={handleClearAll}
                />
            </main>
        </div>
    );
}

export default App;
