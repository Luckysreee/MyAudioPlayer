import React, { useState, useEffect } from 'react';
import AudioPlayer from './components/AudioPlayer';
import LanguageSelector from './components/LanguageSelector';
import AccessibilityToggle from './components/AccessibilityToggle';
import './styles/base.css';

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
    const [theme, setTheme] = useState('dark'); // 'dark' or 'light'
    const [mode, setMode] = useState('player');
    const [zoomLevel, setZoomLevel] = useState(100);
    const [resetKey, setResetKey] = useState(0);

    const t = translations[language];

    // Theme Effect
    useEffect(() => {
        document.body.className = ''; // Clear
        if (isHighContrast) {
            document.body.classList.add('accessibility-mode');
        } else if (theme === 'light') {
            document.body.classList.add('light-theme');
        }
    }, [isHighContrast, theme]);

    // File Handling
    const handleFileSelect = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles((prev) => [...prev, ...selectedFiles]);
        if (currentFileIndex === -1 && selectedFiles.length > 0) setCurrentFileIndex(0);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.target.classList.remove('dragging');
        const allFiles = Array.from(e.dataTransfer.files);
        const audioFiles = allFiles.filter(f => f.type.startsWith('audio/'));
        if (audioFiles.length > 0) {
            setFiles(prev => {
                const newFiles = [...prev, ...audioFiles];
                if (currentFileIndex === -1) setCurrentFileIndex(prev.length);
                return newFiles;
            });
        }
    };

    // Explicit Upload Handler
    const triggerFileUpload = () => {
        document.getElementById('file-upload-input').click();
    };

    const playFile = (index) => { if (index >= 0 && index < files.length) setCurrentFileIndex(index); };
    const nextTrack = () => { if (currentFileIndex < files.length - 1) setCurrentFileIndex(currentFileIndex + 1); };
    const prevTrack = () => { if (currentFileIndex > 0) setCurrentFileIndex(currentFileIndex - 1); };

    const handleDelete = (index) => {
        setFiles(prev => { const newFiles = [...prev]; newFiles.splice(index, 1); return newFiles; });
        if (index === currentFileIndex) setCurrentFileIndex(-1);
        else if (index < currentFileIndex) setCurrentFileIndex(currentFileIndex - 1);
    };

    const handleClearAll = () => { setFiles([]); setCurrentFileIndex(-1); };

    const handleReorder = (newFiles) => {
        setFiles(prev => {
            const playingFile = currentFileIndex !== -1 ? prev[currentFileIndex] : null;
            if (playingFile) {
                const newIndex = newFiles.findIndex(f => f === playingFile);
                if (newIndex !== -1 && newIndex !== currentFileIndex) {
                    setCurrentFileIndex(newIndex);
                }
            }
            return newFiles;
        });
    };

    const handleReorderPlaylist = (index, direction) => {
        const newFiles = [...files];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        if (targetIndex < 0 || targetIndex >= newFiles.length) return;

        // Swap items
        [newFiles[index], newFiles[targetIndex]] = [newFiles[targetIndex], newFiles[index]];

        // Update current file index if needed
        if (currentFileIndex === index) {
            setCurrentFileIndex(targetIndex);
        } else if (currentFileIndex === targetIndex) {
            setCurrentFileIndex(index);
        }

        setFiles(newFiles);
    };

    // Layout: Header -> Content -> Footer
    return (
        <div className="app-container">
            <header className="app-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <h1 style={{ margin: 0, fontSize: '1.2rem' }}>{t.title}</h1>
                    <nav className="tab-bar">
                        <button className={`tab-btn ${mode === 'player' ? 'active' : ''}`} onClick={() => setMode('player')}>{t.player}</button>
                        <button className={`tab-btn ${mode === 'synth' ? 'active' : ''}`} onClick={() => setMode('synth')}>{t.synthesizer}</button>
                        <button className={`tab-btn ${mode === 'stave' ? 'active' : ''}`} onClick={() => setMode('stave')}>{t.staveInput}</button>
                    </nav>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    {/* Zoom Controls */}
                    <div className="zoom-controls" style={{ display: 'flex', gap: '8px', alignItems: 'center', background: 'var(--bg-element)', padding: '4px 8px', borderRadius: '20px' }}>
                        <button onClick={() => setZoomLevel(prev => Math.max(prev - 10, 50))} className="btn-secondary" style={{ border: 'none', padding: '0 5px' }}>-</button>
                        <input
                            type="range"
                            min="50"
                            max="150"
                            value={zoomLevel}
                            onChange={(e) => setZoomLevel(Number(e.target.value))}
                            style={{ width: '60px', margin: 0 }}
                        />
                        <button onClick={() => setZoomLevel(prev => Math.min(prev + 10, 150))} className="btn-secondary" style={{ border: 'none', padding: '0 5px' }}>+</button>
                        <span style={{ fontSize: '0.8rem', minWidth: '35px', textAlign: 'center' }}>{zoomLevel}%</span>
                    </div>

                    <button
                        className="btn-secondary"
                        onClick={() => {
                            // Force re-mount of the AudioPlayer component to reset card positions.
                            // Changing the key prop triggers a full unmount/mount cycle.
                            setResetKey(k => k + 1);
                        }}
                        title="Reset Layout"
                        style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}
                    >
                        ↺
                    </button>
                    <button
                        className="btn-secondary"
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                        style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}
                    >
                        {theme === 'dark' ? '☀' : '☾'}
                    </button>

                    <LanguageSelector currentLang={language} onLanguageChange={setLanguage} />
                    <button
                        className={`a11y-toggle ${isHighContrast ? 'active' : ''}`}
                        onClick={() => setIsHighContrast(!isHighContrast)}
                        title={t.accessibilityMode}
                    >
                        <span>👁</span>
                    </button>
                    <input
                        type="file"
                        id="file-upload-input"
                        multiple
                        accept="audio/*"
                        style={{ display: 'none' }}
                        onChange={handleFileSelect}
                    />
                </div>
            </header>

            <main className="app-content">
                {/* Apply Zoom Here via Transform or Font Size */}
                <div style={{
                    width: '100%',
                    height: '100%',
                    fontSize: `${zoomLevel}%`
                }}>
                    <AudioPlayer
                        key={resetKey}
                        mode={mode}
                        setMode={setMode}
                        currentFile={currentFileIndex !== -1 ? files[currentFileIndex] : null}
                        onEnded={nextTrack}
                        onNext={nextTrack}
                        onPrev={prevTrack}
                        translations={t}
                        files={files}
                        currentFileIndex={currentFileIndex}
                        playFile={playFile}
                        handleDelete={handleDelete}
                        handleClearAll={handleClearAll}
                        dragHandlers={{ onDrop: handleDrop, onDragOver: (e) => e.preventDefault() }}
                        onUploadClick={triggerFileUpload}
                        onReorder={handleReorder}
                        onReorderPlaylist={handleReorderPlaylist}
                    />
                </div>
            </main>

            <footer className="app-footer">
                <div>© 2025 Audio Studio</div>
                <div>v1.0.1</div>
            </footer>
        </div>
    );
}

export default App;
