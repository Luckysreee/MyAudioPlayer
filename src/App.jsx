import React, { useState, useEffect } from 'react';
import AudioPlayer from './components/AudioPlayer';
import LanguageSelector from './components/LanguageSelector';
import AccessibilityToggle from './components/AccessibilityToggle';
import './styles/base.css';
// import './styles/accessibility.css'; // Removed as merged into base.css

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
            {/* SECTION 1: HEADER */}
            <header className="app-header">
                <h1>{t.title}</h1>

                {/* TAB BAR Centered in Header or separate? User said "Header, Mid, Footer". Tabs usually go in Mid top or Header bottom. Let's put them in Header for compactness. */}
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

                <div className="flex-center gap-md">
                    <LanguageSelector currentLang={language} onLanguageChange={setLanguage} />
                    <button
                        className={`a11y-toggle ${isHighContrast ? 'active' : ''}`}
                        onClick={() => setIsHighContrast(!isHighContrast)}
                        title={t.accessibilityMode}
                    >
                        <span style={{ fontSize: '1.2rem' }}>👁</span>
                    </button>
                </div>
            </header>

            {/* SECTION 2: MID CONTENT */}
            <main className="app-content">
                <AudioPlayer
                    mode={mode}
                    setMode={setMode}
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
                    // Drag Drop Props for passing down
                    dragHandlers={{
                        onDragOver: handleDragOver,
                        onDragLeave: handleDragLeave,
                        onDrop: handleDrop
                    }}
                />
            </main>

            {/* SECTION 3: FOOTER */}
            <footer className="app-footer">
                <div>© 2025 Audio Studio</div>
                <div>{mode.toUpperCase()} MODE</div>
            </footer>
        </div>
    );
}

export default App;
