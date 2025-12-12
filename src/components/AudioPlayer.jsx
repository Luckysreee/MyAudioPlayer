import React, { useRef, useState, useEffect } from 'react';
import Visualizer from './Visualizer';
import SynthControls from './SynthControls';
import StaveInput from './StaveInput';

const AudioPlayer = ({ currentFile, onEnded, onNext, onPrev, translations }) => {
    // Mode State: 'player', 'synth', 'stave'
    const [mode, setMode] = useState('player');

    // Shared Audio Context
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);

    // -- PLAYER STATE --
    const audioRef = useRef(null);
    const sourceRef = useRef(null); // MediaElementSource
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    // -- SYNTH STATE --
    const oscillatorRef = useRef(null); // Can hold OscillatorNode OR AudioBufferSourceNode
    const gainNodeRef = useRef(null);
    const [frequency, setFrequency] = useState(440);
    const [waveform, setWaveform] = useState('sine');
    const [isSynthPlaying, setIsSynthPlaying] = useState(false);

    // -- STAVE STATE --
    const [melody, setMelody] = useState([]);
    const [isStavePlaying, setIsStavePlaying] = useState(false);
    const staveNodesRef = useRef([]); // To track active nodes for cancellation

    // Common State
    const [volume, setVolume] = useState(0.5);
    const [isLightTheme, setIsLightTheme] = useState(false);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [analyserNode, setAnalyserNode] = useState(null);

    // Initialize Audio Context once
    useEffect(() => {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioContext();
        audioContextRef.current = ctx;

        const analyser = ctx.createAnalyser();
        analyser.connect(ctx.destination);
        analyserRef.current = analyser;
        setAnalyserNode(analyser);

        return () => {
            ctx.close();
        };
    }, []);

    // Theme & Zoom
    useEffect(() => {
        if (isLightTheme) document.body.classList.add('light-theme');
        else document.body.classList.remove('light-theme');
    }, [isLightTheme]);

    useEffect(() => {
        document.documentElement.style.setProperty('--base-font-size', `${16 * zoomLevel}px`);
    }, [zoomLevel]);


    // -- PLAYER LOGIC --
    useEffect(() => {
        // If file deleted or cleared, stop player
        if (mode === 'player' && !currentFile) {
            handleStop();
            return; // nothing else to do
        }

        if (mode === 'player' && currentFile && audioRef.current && audioContextRef.current) {
            const url = URL.createObjectURL(currentFile);
            audioRef.current.src = url;

            // Connect Audio Element to Analyser (if not already connected)
            if (!sourceRef.current) {
                try {
                    const source = audioContextRef.current.createMediaElementSource(audioRef.current);
                    source.connect(analyserRef.current);
                    sourceRef.current = source;
                } catch (e) {
                    // Already connected or error
                    console.log(e);
                }
            }

            // Play new track
            audioRef.current.play()
                .then(() => setIsPlaying(true))
                .catch(e => console.error("Playback failed", e));

            return () => {
                URL.revokeObjectURL(url);
                setIsPlaying(false);
            };
        } else {
            // If switching away from player, or player mode but no file
            if (audioRef.current) {
                audioRef.current.pause();
                setIsPlaying(false);
            }
        }
    }, [currentFile, mode]);

    const togglePlay = () => {
        if (!audioRef.current || !currentFile) return;
        if (audioContextRef.current.state === 'suspended') audioContextRef.current.resume();

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleStop = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
        setIsPlaying(false);
    };

    // -- AUDIO HELPERS --
    const createNoiseBuffer = (type) => {
        const ctx = audioContextRef.current;
        const bufferSize = ctx.sampleRate * 2; // 2 sec buffer
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = buffer.getChannelData(0);

        if (type === 'pink-noise') {
            // Paul Kellett's refined method
            let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
            for (let i = 0; i < bufferSize; i++) {
                const white = Math.random() * 2 - 1;
                b0 = 0.99886 * b0 + white * 0.0555179;
                b1 = 0.99332 * b1 + white * 0.0750759;
                b2 = 0.96900 * b2 + white * 0.1538520;
                b3 = 0.86650 * b3 + white * 0.3104856;
                b4 = 0.55000 * b4 + white * 0.5329522;
                b5 = -0.7616 * b5 - white * 0.0168980;
                output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
                output[i] *= 0.11;
                b6 = white * 0.115926;
            }
        } else {
            // White noise
            for (let i = 0; i < bufferSize; i++) {
                output[i] = Math.random() * 2 - 1;
            }
        }
        return buffer;
    };

    // -- SYNTH LOGIC --
    const startSynth = () => {
        if (audioContextRef.current.state === 'suspended') audioContextRef.current.resume();
        const ctx = audioContextRef.current;
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(volume, ctx.currentTime);
        gain.connect(analyserRef.current);
        gainNodeRef.current = gain;

        let source;
        if (waveform === 'white-noise' || waveform === 'pink-noise') {
            // Noise
            source = ctx.createBufferSource();
            source.buffer = createNoiseBuffer(waveform);
            source.loop = true;
        } else {
            // Oscillator
            source = ctx.createOscillator();
            source.type = waveform;
            source.frequency.setValueAtTime(frequency, ctx.currentTime);
        }

        source.connect(gain);
        source.start();
        oscillatorRef.current = source;
        setIsSynthPlaying(true);
    };

    const stopSynth = () => {
        if (oscillatorRef.current) {
            oscillatorRef.current.stop();
            oscillatorRef.current.disconnect();
        }
        if (gainNodeRef.current) {
            gainNodeRef.current.disconnect();
        }
        setIsSynthPlaying(false);
    };

    const handleSynthWaveformChange = (val) => {
        setWaveform(val);
        // If playing, restart to apply new type (necessary if switching osc <-> noise)
        if (isSynthPlaying) {
            stopSynth();
            // small timeout to allow state update or immediate restart? 
            // React state update is async, but 'val' is passed here. 
            // We need to wait for state to settle? No, we can pass 'val' to startSynth directly 
            // BUT startSynth reads from 'waveform' state. 
            // Helper wrapping:
            setTimeout(() => {
                // Hacky but simplest to ensure state is set. 
                // Better: Pass config to startSynth
                // Even better: User clicks start again or we auto-restart
            }, 0);
            // Since we use state in startSynth, we should let the user restart or use effect?
            // Let's just stop it. User can restart.
            // OR: We force it.
        }
    };

    // Use Effect to handle waveform switch if playing? 
    // Actually, 'setWaveform' from SynthControls calls setWaveform. 
    // If we want auto-update:
    useEffect(() => {
        if (mode === 'synth' && isSynthPlaying) {
            stopSynth();
            // We need to restart with NEW waveform. 
            // Problem: startSynth reads 'waveform'. 'waveform' is updated.
            // But we need to make sure we don't create loop.
            // Let's just create a ref for immediate access? Or use timeout.
            const timer = setTimeout(() => {
                startSynth();
            }, 10);
            return () => clearTimeout(timer);
        }
    }, [waveform]);
    // Be careful: this triggers on every waveform change.

    // Also frequency change
    useEffect(() => {
        if (mode === 'synth' && isSynthPlaying && oscillatorRef.current && oscillatorRef.current.frequency) {
            // Only for OscillatorNode, not AudioBufferSourceNode
            oscillatorRef.current.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime);
        }
    }, [frequency]);


    // -- STAVE LOGIC --
    const getNoteFrequency = (note, octave) => {
        const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        // Enharmonic handling can be complex, simplifying:
        // Input is A-G and optional #.
        let baseIndex = notes.indexOf(note);
        if (baseIndex === -1 && note.includes('#')) {
            // Try split? passed note is usually "C" or "C#"
            // If code passed "C#", index is 1.
        }
        // Actually, note comes split from StaveInput as 'C' and '#'

        // Let's re-parse or assume 'note' arg is e.g. "C" or "C#"
        // My function signature: getNoteFrequency(noteName (e.g. C#), octave)

        // Wait, StaveInput passes note parts. 
        // Let's assume input is concatenated
    };

    const playStave = () => {
        if (isStavePlaying) {
            // Stop logic
            stopStave();
            return;
        }

        if (melody.length === 0) return;
        if (audioContextRef.current.state === 'suspended') audioContextRef.current.resume();

        const ctx = audioContextRef.current;
        const now = ctx.currentTime;
        let cumulativeTime = now;

        const activeNodes = [];

        melody.forEach(m => {
            const noteName = m.note + m.accidental;
            const oct = m.octave;
            const dur = m.duration;

            // Calculate freq
            const noteMap = { 'C': -9, 'C#': -8, 'D': -7, 'D#': -6, 'E': -5, 'F': -4, 'F#': -3, 'G': -2, 'G#': -1, 'A': 0, 'A#': 1, 'B': 2 };
            const semitone = noteMap[noteName];
            if (semitone === undefined) return; // skip invalid

            // A4 = 440 (Octave 4)
            // Diff from A4 = semitone + (oct - 4)*12
            const totalSemitones = semitone + (oct - 4) * 12;
            const freq = 440 * Math.pow(2, totalSemitones / 12);

            // Create nodes
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine'; // Basic tone
            osc.frequency.value = freq;

            // Routing
            osc.connect(gain);
            gain.connect(analyserRef.current);

            // Envelope
            const attack = 0.05;
            const release = 0.05;

            // Schedule
            osc.start(cumulativeTime);
            gain.gain.setValueAtTime(0, cumulativeTime);
            gain.gain.linearRampToValueAtTime(volume, cumulativeTime + attack);
            gain.gain.setValueAtTime(volume, cumulativeTime + dur - release);
            gain.gain.linearRampToValueAtTime(0, cumulativeTime + dur);
            osc.stop(cumulativeTime + dur);

            activeNodes.push({ osc, gain });

            cumulativeTime += dur;
        });

        staveNodesRef.current = activeNodes;
        setIsStavePlaying(true);

        // Auto stop state when done
        const totalDuration = cumulativeTime - now;
        setTimeout(() => {
            setIsStavePlaying(false);
            staveNodesRef.current = [];
        }, totalDuration * 1000);
    };

    const stopStave = () => {
        staveNodesRef.current.forEach(node => {
            try {
                node.osc.stop();
                node.osc.disconnect();
                node.gain.disconnect();
            } catch (e) { /* ignore already stopped */ }
        });
        staveNodesRef.current = [];
        setIsStavePlaying(false);
    };

    // Global stop (switching modes)
    const handleGlobalStop = () => {
        handleStop(); // Player
        stopSynth(); // Synth
        stopStave(); // Stave
    };


    // -- COMMON LOGIC --
    const handleVolumeChange = (e) => {
        const vol = Number(e.target.value);
        setVolume(vol);

        // Player Volume
        if (audioRef.current) audioRef.current.volume = vol;

        // Synth Volume
        if (gainNodeRef.current) {
            gainNodeRef.current.gain.setValueAtTime(vol, audioContextRef.current.currentTime);
        }

        // Stave Volume? 
        // Stave uses scheduled envelopes, so changing volume mid-playback is hard without iterating active nodes.
        // For now, new notes get new volume. Real-time update for scheduled notes is complex. 
        // We accept that limitation or try to target active gains.
        staveNodesRef.current.forEach(n => {
            // This cancels the envelope if we just set value.
            // Keep simple.
        });
    };

    // Monitor mode switch to stop everything
    // Actually handled in render select onChange.

    const formatTime = (time) => {
        if (isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <div className="card audio-player">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2>{mode === 'player' ? translations.player : (mode === 'synth' ? translations.synthesizer : translations.staveInput)}</h2>
                <select value={mode} onChange={(e) => {
                    handleGlobalStop(); // Reset all audio
                    setMode(e.target.value);
                }}>
                    <option value="player">{translations.player}</option>
                    <option value="synth">{translations.synthesizer}</option>
                    <option value="stave">{translations.staveInput || "Stave Input"}</option>
                </select>
            </div>

            {/* Shared Visualizer */}
            <Visualizer analyser={analyserNode} isPlaying={isPlaying || isSynthPlaying || isStavePlaying} />

            {/* --- PLAYER UI --- */}
            <div style={{ display: mode === 'player' ? 'block' : 'none' }}>
                <h3>{currentFile ? currentFile.name : translations.noFileSelected}</h3>

                <audio
                    ref={audioRef}
                    onTimeUpdate={() => audioRef.current && setCurrentTime(audioRef.current.currentTime)}
                    onLoadedMetadata={() => audioRef.current && setDuration(audioRef.current.duration)}
                    onEnded={onEnded}
                    crossOrigin="anonymous"
                />

                <div className="controls">
                    <input
                        type="range"
                        min="0"
                        max={duration || 0}
                        value={currentTime}
                        onChange={(e) => {
                            const time = Number(e.target.value);
                            if (audioRef.current) {
                                audioRef.current.currentTime = time;
                                setCurrentTime(time);
                            }
                        }}
                        disabled={!currentFile}
                    />
                    <div className="time-display">
                        <span>{formatTime(currentTime)}</span> / <span>{formatTime(duration)}</span>
                    </div>

                    <div className="buttons">
                        <button onClick={onPrev} disabled={!currentFile}>⏮</button>
                        <button onClick={togglePlay} disabled={!currentFile}>
                            {isPlaying ? translations.paused : translations.playing}
                        </button>
                        <button onClick={handleStop} disabled={!currentFile}>⏹ {translations.reset || "Replay"}</button>
                        <button onClick={onNext} disabled={!currentFile}>⏭</button>
                    </div>
                </div>
            </div>

            {/* --- SYNTH UI --- */}
            <div style={{ display: mode === 'synth' ? 'block' : 'none' }}>
                <SynthControls
                    frequency={frequency}
                    setFrequency={setFrequency}
                    waveform={waveform}
                    setWaveform={setWaveform} // This will trigger Effect to restart
                    volume={volume}
                    isPlaying={isSynthPlaying}
                    onStart={startSynth}
                    onStop={stopSynth}
                    translations={translations}
                />
            </div>

            {/* --- STAVE UI --- */}
            <div style={{ display: mode === 'stave' ? 'block' : 'none' }}>
                <StaveInput
                    melody={melody}
                    setMelody={setMelody}
                    onPlay={playStave}
                    isPlaying={isStavePlaying}
                    translations={translations}
                />
            </div>

            <hr style={{ width: '100%', opacity: 0.2, margin: '2rem 0' }} />

            {/* GLOBAL CONTROLS */}
            <div className="control-group">
                <label>{translations.volume}</label>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                />
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <div className="control-group" style={{ flex: 1 }}>
                    <label>{translations.theme}</label>
                    <button onClick={() => setIsLightTheme(!isLightTheme)} style={{ width: '100%', margin: 0 }}>
                        {isLightTheme ? 'Dark Mode' : 'Light Mode'}
                    </button>
                </div>

                <div className="control-group" style={{ flex: 1 }}>
                    <label>{translations.zoom}</label>
                    <input
                        type="range"
                        min="0.8"
                        max="2"
                        step="0.1"
                        value={zoomLevel}
                        onChange={(e) => setZoomLevel(Number(e.target.value))}
                        disabled={mode === 'synth' && false /* requirement said seek bar, not zoom */}
                    />
                </div>
            </div>

        </div>
    );
};

export default AudioPlayer;
