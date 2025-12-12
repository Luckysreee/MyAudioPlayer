import React, { useState } from 'react';

const StaveInput = ({ melody, setMelody, onPlay, isPlaying, translations }) => {
    const [inputMode, setInputMode] = useState('piano'); // 'text', 'builder', 'piano'
    const [textInput, setTextInput] = useState('');
    const [error, setError] = useState('');

    // Builder State
    const [note, setNote] = useState('C');
    const [accidental, setAccidental] = useState('');
    const [octave, setOctave] = useState('4');
    const [duration, setDuration] = useState('0.5');

    // Piano State helpers
    const pianoKeys = [
        { note: 'C', type: 'white' },
        { note: 'C#', type: 'black' },
        { note: 'D', type: 'white' },
        { note: 'D#', type: 'black' },
        { note: 'E', type: 'white' },
        { note: 'F', type: 'white' },
        { note: 'F#', type: 'black' },
        { note: 'G', type: 'white' },
        { note: 'G#', type: 'black' },
        { note: 'A', type: 'white' },
        { note: 'A#', type: 'black' },
        { note: 'B', type: 'white' },
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
        // keyNote is "C", "C#" etc.
        const n = keyNote.charAt(0);
        const acc = keyNote.length > 1 ? '#' : '';
        const newNote = {
            note: n,
            accidental: acc,
            octave: 4, // Default octave for piano click
            duration: 0.5,
            id: Date.now() + Math.random()
        };
        setMelody([...melody, newNote]);
    };

    const handleDeleteNote = (id) => {
        setMelody(melody.filter(n => n.id !== id));
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
            <div className="input-area" style={{ minHeight: '150px' }}>
                {inputMode === 'piano' && (
                    <div className="piano-wrapper" style={{ textAlign: 'center' }}>
                        <p style={{ marginBottom: '0.5rem', opacity: 0.7 }}>Click keys to add notes (Octave 4, 0.5s)</p>
                        <div className="piano-keys">
                            {pianoKeys.map(k => (
                                <div
                                    key={k.note}
                                    className={`key ${k.type}`}
                                    onClick={() => handlePianoClick(k.note)}
                                >
                                    {k.note}
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
                        />
                        {error && <div style={{ color: 'var(--error)', margin: '0.5rem 0' }}>{error}</div>}
                        <button onClick={handleTextSubmit} className="btn-secondary mt-4" style={{ width: '100%' }}>{translations.addNote || "Add Notes"}</button>
                    </div>
                )}

                {inputMode === 'builder' && (
                    <div className="builder-mode flex-center gap-md" style={{ flexWrap: 'wrap' }}>
                        <select value={note} onChange={e => setNote(e.target.value)} style={{ width: '60px' }}>
                            {['A', 'B', 'C', 'D', 'E', 'F', 'G'].map(n => <option key={n} value={n}>{n}</option>)}
                        </select>
                        <select value={accidental} onChange={e => setAccidental(e.target.value)} style={{ width: '60px' }}>
                            <option value="">nat</option>
                            <option value="#">#</option>
                        </select>
                        <select value={octave} onChange={e => setOctave(e.target.value)} style={{ width: '60px' }}>
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                        <select value={duration} onChange={e => setDuration(e.target.value)} style={{ width: '80px' }}>
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

            {/* MELODY TABLE */}
            <div className="melody-display mt-4">
                <div className="flex-between mb-4">
                    <h4>{translations.melody}</h4>
                    <div>
                        {!isPlaying ? (
                            <button onClick={onPlay} disabled={melody.length === 0} className="btn-primary" style={{ width: '40px', height: '40px', fontSize: '1rem' }}>▶</button>
                        ) : (
                            <button onClick={onPlay} className="btn-primary" style={{ width: '40px', height: '40px', fontSize: '1rem', background: 'var(--error)' }}>⏹</button>
                        )}
                    </div>
                </div>

                {melody.length === 0 ? <p style={{ fontStyle: 'italic', opacity: 0.4, textAlign: 'center', padding: '1rem' }}>Empty</p> : (
                    <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid var(--glass-border)', borderRadius: '8px' }}>
                        <table style={{ width: '100%' }}>
                            <thead>
                                <tr>
                                    <th>Note</th>
                                    <th>Oct</th>
                                    <th>Dur</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {melody.map((m, idx) => (
                                    <tr key={m.id || idx}>
                                        <td>{m.note}{m.accidental}</td>
                                        <td>{m.octave}</td>
                                        <td>{m.duration}s</td>
                                        <td style={{ textAlign: 'center' }}>
                                            <button
                                                onClick={() => handleDeleteNote(m.id)}
                                                style={{ padding: '4px 8px', fontSize: '0.8rem', background: 'transparent', color: 'var(--error)' }}
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
                <div style={{ textAlign: 'right', marginTop: '0.5rem' }}>
                    <button onClick={() => setMelody([])} style={{ fontSize: '0.8rem', background: 'transparent', color: 'inherit', opacity: 0.6 }}>{translations.clearAll || "Clear"}</button>
                </div>
            </div>
        </div>
    );
};

export default StaveInput;
