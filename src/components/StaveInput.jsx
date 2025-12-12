import React, { useState } from 'react';

const StaveInput = ({ melody, setMelody, onPlay, isPlaying, translations }) => {
    const [inputMode, setInputMode] = useState('builder'); // 'text' or 'builder'
    const [textInput, setTextInput] = useState('');
    const [error, setError] = useState('');

    // Builder State
    const [note, setNote] = useState('C');
    const [accidental, setAccidental] = useState('');
    const [octave, setOctave] = useState('4');
    const [duration, setDuration] = useState('0.5');

    const handleTextChange = (e) => {
        setTextInput(e.target.value);
        setError('');
    };

    const parseTextLine = (line) => {
        // Format: "C4 0.5" or "C#4 1"
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
        setMelody(newNotes);
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

    const handleDeleteNote = (id) => {
        setMelody(melody.filter(n => n.id !== id));
    };

    return (
        <div className="stave-input-container">
            <div className="mode-selector" style={{ marginBottom: '1rem' }}>
                <label style={{ marginRight: '1rem' }}>
                    <input
                        type="radio"
                        name="inputMode"
                        checked={inputMode === 'builder'}
                        onChange={() => setInputMode('builder')}
                    /> {translations.builderMode}
                </label>
                <label>
                    <input
                        type="radio"
                        name="inputMode"
                        checked={inputMode === 'text'}
                        onChange={() => setInputMode('text')}
                    /> {translations.textMode}
                </label>
            </div>

            {inputMode === 'text' ? (
                <div className="text-mode">
                    <textarea
                        rows="5"
                        value={textInput}
                        onChange={handleTextChange}
                        placeholder="C4 0.5&#10;E4 0.5"
                        style={{ width: '100%', marginBottom: '0.5rem' }}
                    />
                    {error && <div className="error-message" style={{ color: 'red', marginBottom: '0.5rem' }}>{error}</div>}
                    <button onClick={handleTextSubmit}>{translations.addNote || "Add Notes"}</button>
                </div>
            ) : (
                <div className="builder-mode control-group" style={{ flexDirection: 'row', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
                    <select value={note} onChange={e => setNote(e.target.value)}>
                        {['A', 'B', 'C', 'D', 'E', 'F', 'G'].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                    <select value={accidental} onChange={e => setAccidental(e.target.value)}>
                        <option value="">(none)</option>
                        <option value="#">#</option>
                    </select>
                    <select value={octave} onChange={e => setOctave(e.target.value)}>
                        {[1, 2, 3, 4, 5, 6, 7].map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                    <select value={duration} onChange={e => setDuration(e.target.value)}>
                        <option value="0.25">0.25s</option>
                        <option value="0.5">0.5s</option>
                        <option value="0.75">0.75s</option>
                        <option value="1">1s</option>
                        <option value="2">2s</option>
                    </select>
                    <button onClick={handleAddNote}>{translations.addNote}</button>
                </div>
            )}

            <div className="melody-display" style={{ marginTop: '1rem' }}>
                <h4>{translations.melody}</h4>
                {melody.length === 0 ? <p style={{ fontStyle: 'italic', opacity: 0.6 }}>No notes added</p> : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '0.5rem' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #ccc' }}>
                                <th style={{ textAlign: 'left' }}>Note</th>
                                <th style={{ textAlign: 'left' }}>Octave</th>
                                <th style={{ textAlign: 'left' }}>Duration</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {melody.map((m, idx) => (
                                <tr key={m.id || idx} style={{ borderBottom: '1px solid #333' }}>
                                    <td>{m.note}{m.accidental}</td>
                                    <td>{m.octave}</td>
                                    <td>{m.duration}s</td>
                                    <td style={{ textAlign: 'center' }}>
                                        <button
                                            onClick={() => handleDeleteNote(m.id)}
                                            style={{ padding: '2px 8px', fontSize: '0.8rem', background: '#ff4444' }}
                                        >
                                            X
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <div className="play-controls" style={{ marginTop: '1rem' }}>
                {!isPlaying ? (
                    <button onClick={onPlay} disabled={melody.length === 0}>{translations.playStave}</button>
                ) : (
                    <button onClick={onPlay} className="stop-btn">{translations.stopSound || "Stop"}</button> // Reusing onPlay to toggle/stop
                )}
                <button onClick={() => setMelody([])} style={{ marginLeft: '0.5rem', background: '#666' }}>{translations.reset}</button>
            </div>
        </div>
    );
};

export default StaveInput;
