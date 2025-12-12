import React, { useState } from 'react';

// 1. STAVE CONTROLS (Play/Stop/Clear + Visualizer placeholder if we moved it here, but Visualizer is in parent)
export const StaveControls = ({ onPlay, isPlaying, onClear, melody, translations }) => (
    <div className="flex-center gap-md" style={{ width: '100%', padding: '1rem' }}>
        <button
            onClick={onPlay}
            className="btn-primary"
            disabled={melody.length === 0}
            style={{
                width: '100%',
                height: '45px',
                borderRadius: '8px',
                fontSize: '1rem',
                background: isPlaying ? 'var(--error-color)' : 'var(--surface-color)',
                borderColor: isPlaying ? 'var(--error-color)' : 'var(--primary-color)',
                color: isPlaying ? '#fff' : 'var(--primary-color)',
                boxShadow: isPlaying ? 'none' : '0 0 10px rgba(0,0,0,0.2)'
            }}
        >
            {isPlaying ? "⏹ Stop" : "▶ Play Melody"}
        </button>
        <button
            onClick={onClear}
            disabled={melody.length === 0}
            className="btn-secondary"
            style={{ height: '45px', whiteSpace: 'nowrap' }}
        >
            {translations.clearAll || "Clear"}
        </button>
    </div>
);

// 2. MELODY TABLE
export const MelodyTable = ({ melody, onDelete, translations }) => (
    <div className="melody-display" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {melody.length === 0 ? <p style={{ fontStyle: 'italic', opacity: 0.4, textAlign: 'center', padding: '1rem' }}>{translations.empty || "No notes added"}</p> : (
            <div style={{ flex: 1, overflowY: 'auto', border: '1px solid var(--glass-border)', borderRadius: '8px' }} className="no-drag">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ background: 'rgba(255,255,255,0.05)', position: 'sticky', top: 0 }}>
                        <tr>
                            <th style={{ padding: '8px', textAlign: 'left' }}>Note</th>
                            <th style={{ padding: '8px', textAlign: 'left' }}>Oct</th>
                            <th style={{ padding: '8px', textAlign: 'left' }}>Dur</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {melody.map((m, idx) => (
                            <tr key={m.id || idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <td style={{ padding: '8px' }}>{m.note}{m.accidental}</td>
                                <td style={{ padding: '8px' }}>{m.octave}</td>
                                <td style={{ padding: '8px' }}>{m.duration}s</td>
                                <td style={{ textAlign: 'center', padding: '8px' }}>
                                    <button
                                        onClick={() => onDelete(m.id)}
                                        style={{ padding: '4px 8px', fontSize: '0.8rem', background: 'transparent', color: 'var(--error-color)', border: 'none', cursor: 'pointer' }}
                                    >
                                        ✕
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
    </div>
);

// 3. MAIN EDITOR (Input Modes)
const StaveInput = ({ melody, setMelody, translations }) => {
    const [inputMode, setInputMode] = useState('piano'); // 'text', 'builder', 'piano'
    const [textInput, setTextInput] = useState('');
    const [error, setError] = useState('');

    // Builder State
    const [note, setNote] = useState('C');
    const [accidental, setAccidental] = useState('');
    const [octave, setOctave] = useState('4');
    const [duration, setDuration] = useState('0.5');

    // Piano State helpers - FULL OCTAVE
    const pianoKeys = [
        { note: 'C', type: 'white', pos: 0 },
        { note: 'C#', type: 'black', pos: 1 },
        { note: 'D', type: 'white', pos: 2 },
        { note: 'D#', type: 'black', pos: 3 },
        { note: 'E', type: 'white', pos: 4 },
        { note: 'F#', type: 'black', pos: 6 }, // Corrected missing index 5 in previous array but logic seemed ok? 
        // Wait, array was: C, C#, D, D#, E, F, F#, G, G#, A, A#, B
        // Indices: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11.
        // F is index 5. F# is 6.
        // Let's stick to the previous array definition but ensure keys are correct.
    ];

    const fullPianoKeys = [
        { note: 'C', type: 'white' }, { note: 'C#', type: 'black' },
        { note: 'D', type: 'white' }, { note: 'D#', type: 'black' },
        { note: 'E', type: 'white' },
        { note: 'F', type: 'white' }, { note: 'F#', type: 'black' },
        { note: 'G', type: 'white' }, { note: 'G#', type: 'black' },
        { note: 'A', type: 'white' }, { note: 'A#', type: 'black' },
        { note: 'B', type: 'white' }
    ];

    const handleTextChange = (e) => {
        setTextInput(e.target.value);
        setError('');
    };

    const parseTextLine = (line) => {
        const parts = line.trim().split(/\s+/);
        if (parts.length !== 2) return null;
        const notePart = parts[0].match(/^([A-G])(#?)(\d)$/);
        if (!notePart) return null;
        const dur = parseFloat(parts[1]);
        if (isNaN(dur)) return null;
        return {
            note: notePart[1],
            accidental: notePart[2] || '',
            octave: parseInt(notePart[3]),
            duration: dur,
            id: Date.now() + Math.random()
        };
    };

    const handleTextSubmit = () => {
        const lines = textInput.split('\n');
        const newNotes = [];
        for (let line of lines) {
            if (!line.trim()) continue;
            const parsed = parseTextLine(line);
            if (!parsed) {
                setError(`${translations.invalidNote || "Invalid note format"}: "${line}"`);
                return;
            }
            newNotes.push(parsed);
        }
        setMelody([...melody, ...newNotes]);
        setError('');
        setTextInput('');
    };

    const handleAddNote = () => {
        const newNote = {
            note: note,
            accidental: accidental,
            octave: parseInt(octave),
            duration: parseFloat(duration),
            id: Date.now() + Math.random()
        };
        setMelody([...melody, newNote]);
    };

    const handlePianoClick = (keyNote) => {
        const n = keyNote.charAt(0);
        const acc = keyNote.length > 1 ? '#' : '';
        const newNote = {
            note: n,
            accidental: acc,
            octave: 4,
            duration: 0.5,
            id: Date.now() + Math.random()
        };
        setMelody([...melody, newNote]);
    };

    return (
        <div className="stave-input-container">
            {/* Mode switch */}
            <div className="flex-center gap-md mb-4" style={{ background: 'rgba(0,0,0,0.2)', padding: '0.5rem', borderRadius: '8px', width: 'fit-content', margin: '0 auto 1rem auto' }}>
                <label style={{ cursor: 'pointer', opacity: inputMode === 'piano' ? 1 : 0.5 }}>
                    <input type="radio" name="inputMode" checked={inputMode === 'piano'} onChange={() => setInputMode('piano')} style={{ marginRight: '5px' }} />
                    Piano
                </label>
                <label style={{ cursor: 'pointer', opacity: inputMode === 'builder' ? 1 : 0.5 }}>
                    <input type="radio" name="inputMode" checked={inputMode === 'builder'} onChange={() => setInputMode('builder')} style={{ marginRight: '5px' }} />
                    {translations.builderMode}
                </label>
                <label style={{ cursor: 'pointer', opacity: inputMode === 'text' ? 1 : 0.5 }}>
                    <input type="radio" name="inputMode" checked={inputMode === 'text'} onChange={() => setInputMode('text')} style={{ marginRight: '5px' }} />
                    {translations.textMode}
                </label>
            </div>

            {/* INPUT AREAS */}
            <div className="input-area" style={{ minHeight: '180px' }}>
                {inputMode === 'piano' && (
                    <div className="piano-wrapper">
                        <div className="piano-keys">
                            {fullPianoKeys.map(k => (
                                <div
                                    key={k.note}
                                    className={`key ${k.type} no-drag`}
                                    onClick={() => handlePianoClick(k.note)}
                                    title={k.note}
                                >
                                    <span style={{
                                        position: 'absolute',
                                        bottom: '5px',
                                        width: '100%',
                                        textAlign: 'center',
                                        fontSize: '0.6rem',
                                        color: k.type === 'black' ? '#fff' : '#000',
                                        pointerEvents: 'none'
                                    }}>
                                        {k.note}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {inputMode === 'text' && (
                    <div className="text-mode">
                        <textarea
                            rows="5"
                            value={textInput}
                            onChange={handleTextChange}
                            placeholder="C4 0.5&#10;E4 0.5"
                            className="no-drag"
                            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--primary-color)', background: 'var(--surface-color)', color: 'var(--text-color)' }}
                        />
                        {error && <div style={{ color: 'var(--error-color)', margin: '0.5rem 0' }}>{error}</div>}
                        <button onClick={handleTextSubmit} className="btn-secondary mt-4" style={{ width: '100%' }}>{translations.addNote || "Add Notes"}</button>
                    </div>
                )}

                {inputMode === 'builder' && (
                    <div className="builder-mode flex-center gap-md" style={{ flexWrap: 'wrap' }}>
                        <select value={note} onChange={e => setNote(e.target.value)} style={{ width: '60px' }} className="no-drag">
                            {['A', 'B', 'C', 'D', 'E', 'F', 'G'].map(n => <option key={n} value={n}>{n}</option>)}
                        </select>
                        <select value={accidental} onChange={e => setAccidental(e.target.value)} style={{ width: '60px' }} className="no-drag">
                            <option value="">nat</option>
                            <option value="#">#</option>
                        </select>
                        <select value={octave} onChange={e => setOctave(e.target.value)} style={{ width: '60px' }} className="no-drag">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                        <select value={duration} onChange={e => setDuration(e.target.value)} style={{ width: '80px' }} className="no-drag">
                            <option value="0.25">0.25s</option>
                            <option value="0.5">0.5s</option>
                            <option value="0.75">0.75s</option>
                            <option value="1">1s</option>
                            <option value="2">2s</option>
                        </select>
                        <button onClick={handleAddNote} className="btn-secondary">{translations.addNote}</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StaveInput;
