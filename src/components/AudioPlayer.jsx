
import React, { useState, useRef, useEffect } from 'react';
import DraggableCard from './DraggableCard';
import Visualizer from './Visualizer';
import Playlist from './Playlist';
import SynthControls from './SynthControls';
import StaveInput, { StaveControls, MelodyTable } from './StaveInput';
import StaveVisualizer from './StaveVisualizer';
import SynthAnimation from './SynthAnimation';

const AudioPlayer = ({
    mode,
    setMode,
    currentFile,
    onEnded,
    onNext,
    onPrev,
    translations,
    files,
    currentFileIndex,
    playFile,
    handleDelete,
    handleClearAll,
    dragHandlers,
    onUploadClick,
    onReorder,
    onReorderPlaylist
}) => {
    const audioRef = useRef(null);
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const sourceRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    // Synth Refs
    const oscillatorRef = useRef(null);
    const gainNodeRef = useRef(null);
    const [frequency, setFrequency] = useState(440);
    const [waveform, setWaveform] = useState('sine');
    const [isSynthPlaying, setIsSynthPlaying] = useState(false);

    // Stave/Melody State
    const [melody, setMelody] = useState([]);
    const [isStavePlaying, setIsStavePlaying] = useState(false);
    const [currentNoteIndex, setCurrentNoteIndex] = useState(-1);

    // Global Volume
    const [volume, setVolume] = useState(0.5);
    const volumeRef = useRef(0.5);
    const [analyserNode, setAnalyserNode] = useState(null);

    // Update volume ref when volume state changes
    useEffect(() => {
        volumeRef.current = volume;
    }, [volume]);

    // Initializer
    useEffect(() => {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioContext();
        audioContextRef.current = ctx;

        const analyser = ctx.createAnalyser();
        analyser.connect(ctx.destination);
        analyserRef.current = analyser;
        setAnalyserNode(analyser);

        const gainNode = ctx.createGain();
        gainNode.gain.value = volume;
        gainNode.connect(analyser); // Connect Synth to Analyser
        gainNodeRef.current = gainNode;

        return () => {
            if (ctx.state !== 'closed') ctx.close();
        };
    }, []);

    // SYNTH LOGIC
    useEffect(() => {
        if (isSynthPlaying && audioContextRef.current && gainNodeRef.current) {
            // Stop existing if any
            if (oscillatorRef.current) {
                try { oscillatorRef.current.stop(); } catch (e) { }
                oscillatorRef.current = null;
            }

            if (waveform === 'white-noise' || waveform === 'pink-noise') {
                // Noise Generation
                const bufferSize = audioContextRef.current.sampleRate * 2; // 2 seconds buffer
                const buffer = audioContextRef.current.createBuffer(1, bufferSize, audioContextRef.current.sampleRate);
                const data = buffer.getChannelData(0);

                if (waveform === 'white-noise') {
                    for (let i = 0; i < bufferSize; i++) {
                        data[i] = Math.random() * 2 - 1;
                    }
                } else {
                    // Pink Noise (Approximation)
                    let b0, b1, b2, b3, b4, b5, b6;
                    b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;
                    for (let i = 0; i < bufferSize; i++) {
                        const white = Math.random() * 2 - 1;
                        b0 = 0.99886 * b0 + white * 0.0555179;
                        b1 = 0.99332 * b1 + white * 0.0750759;
                        b2 = 0.96900 * b2 + white * 0.1538520;
                        b3 = 0.86650 * b3 + white * 0.3104856;
                        b4 = 0.55000 * b4 + white * 0.5329522;
                        b5 = -0.7616 * b5 - white * 0.0168981;
                        data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
                        data[i] *= 0.11; // (roughly) compensate for gain
                        b6 = white * 0.115926;
                    }
                }

                const noise = audioContextRef.current.createBufferSource();
                noise.buffer = buffer;
                noise.loop = true;
                noise.connect(gainNodeRef.current);
                noise.start();
                oscillatorRef.current = noise; // Storing noise source in oscillatorRef for convenience

            } else {
                // Oscillator
                const osc = audioContextRef.current.createOscillator();
                osc.type = waveform;
                osc.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime);
                osc.connect(gainNodeRef.current);
                osc.start();
                oscillatorRef.current = osc;
            }

        } else {
            if (oscillatorRef.current) {
                try { oscillatorRef.current.stop(); } catch (e) { }
                oscillatorRef.current = null;
            }
        }
    }, [isSynthPlaying, waveform, frequency]); // Added frequency to dependency for initial start, though tone update is separate

    // Live Frequency Update
    useEffect(() => {
        if (oscillatorRef.current && isSynthPlaying && oscillatorRef.current.frequency) {
            oscillatorRef.current.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime);
        }
    }, [frequency, isSynthPlaying]);

    // STAVE LOGIC
    const timeoutIdRef = useRef(null);
    const shouldContinueRef = useRef(false);

    const playMelody = () => {
        if (isStavePlaying) {
            // Stop playback
            setIsStavePlaying(false);
            shouldContinueRef.current = false;
            setCurrentNoteIndex(-1);

            if (oscillatorRef.current) {
                try {
                    oscillatorRef.current.stop();
                } catch (e) {
                    // Oscillator may already be stopped
                }
                oscillatorRef.current = null;
            }
            if (timeoutIdRef.current) {
                clearTimeout(timeoutIdRef.current);
                timeoutIdRef.current = null;
            }
            return;
        }

        if (!melody.length || !gainNodeRef.current) return;

        setIsStavePlaying(true);
        shouldContinueRef.current = true;
        let idx = 0;

        const playNext = () => {
            if (idx >= melody.length || !gainNodeRef.current || !shouldContinueRef.current) {
                setIsStavePlaying(false);
                shouldContinueRef.current = false;
                setCurrentNoteIndex(-1);
                oscillatorRef.current = null;
                timeoutIdRef.current = null;
                return;
            }

            // Highlight current note
            setCurrentNoteIndex(idx);

            const m = melody[idx];
            const noteFreq = (() => {
                const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
                const baseNote = noteNames.indexOf(m.note + (m.accidental || ''));
                if (baseNote === -1) return 440;
                const A4 = 440;
                const semitonesFromA4 = (m.octave - 4) * 12 + (baseNote - 9);
                return A4 * Math.pow(2, semitonesFromA4 / 12);
            })();

            const osc = audioContextRef.current.createOscillator();
            const noteGain = audioContextRef.current.createGain();

            osc.type = 'sine';
            osc.frequency.value = noteFreq;

            // Connect: oscillator -> noteGain -> mainGain -> analyser
            osc.connect(noteGain);
            noteGain.connect(gainNodeRef.current);

            // Apply volume to this note's gain
            noteGain.gain.value = volumeRef.current;

            osc.start();
            oscillatorRef.current = osc;

            timeoutIdRef.current = setTimeout(() => {
                if (oscillatorRef.current) {
                    try {
                        oscillatorRef.current.stop();
                    } catch (e) {
                        // Already stopped
                    }
                }
                idx++;
                if (shouldContinueRef.current) {
                    playNext();
                }
            }, m.duration * 1000);
        };

        playNext();
    };

    // Handle File Playback
    useEffect(() => {
        if (currentFile && audioRef.current) {
            // Re-connect audio element if needed
            if (!sourceRef.current && audioContextRef.current) {
                const src = audioContextRef.current.createMediaElementSource(audioRef.current);
                sourceRef.current = src;
                src.connect(analyserRef.current);
            }
            audioRef.current.src = URL.createObjectURL(currentFile);
            audioRef.current.play().then(() => setIsPlaying(true)).catch(e => console.error(e));
        } else if (audioRef.current) {
            audioRef.current.pause();
            setIsPlaying(false);
        }
    }, [currentFile]);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
                audioContextRef.current.suspend();
            } else {
                audioRef.current.play();
                audioContextRef.current.resume();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleVolumeChange = (e) => {
        const val = parseFloat(e.target.value);
        setVolume(val);
        if (gainNodeRef.current) gainNodeRef.current.gain.value = val;
        if (audioRef.current) audioRef.current.volume = val;
    };

    const formatTime = (time) => {
        if (!time) return "0:00";
        const min = Math.floor(time / 60);
        const sec = Math.floor(time % 60);
        return `${min}:${sec < 10 ? '0' + sec : sec}`;
    };

    // PLAYER MODE LAYOUT (Restored: Top Player / Bottom Upload)
    const renderPlayerMode = () => (
        <>
            {/* 1. Controls/Player Card (Top-Left: 65%) */}
            <DraggableCard
                title={currentFile ? currentFile.name : translations.player}
                initialPos={{ x: '16px', y: '16px' }}
                initialSize={{ width: 'calc(70% - 24px)', height: 'calc(65% - 24px)' }}
                className="controls-card"
            >
                <div className="visualizer-container" style={{ flex: 1, minHeight: '50%', background: '#000', borderRadius: '8px', overflow: 'hidden', position: 'relative' }}>
                    <Visualizer analyser={analyserNode} isPlaying={isPlaying || isSynthPlaying} />
                    {!currentFile && !isSynthPlaying && <div className="absolute-center" style={{ opacity: 0.3 }}>NO SIGNAL</div>}
                </div>

                <div className="controls-area" style={{ padding: '0 2rem', display: 'flex', flexDirection: 'column', height: '50%', justifyContent: 'center' }}>
                    {/* Timestamps */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                    </div>

                    {/* Progress Slider */}
                    <input
                        type="range"
                        min="0"
                        max={duration || 0}
                        value={currentTime}
                        onChange={(e) => {
                            const time = Number(e.target.value);
                            if (audioRef.current) { audioRef.current.currentTime = time; setCurrentTime(time); }
                        }}
                        className="no-drag custom-slider"
                        style={{ width: '100%', marginBottom: '1.5rem', cursor: 'pointer' }}
                    />

                    {/* Controls Row: Volume Left | Center Play | Space Right */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center' }}>

                        {/* Volume (Left Side) */}
                        <div className="volume-control flex-center gap-sm" style={{ justifySelf: 'start' }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" /></svg>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={volume}
                                onChange={handleVolumeChange}
                                className="no-drag custom-slider"
                                style={{ width: '80px' }}
                            />
                        </div>

                        {/* Playback Buttons (Center) */}
                        <div className="flex-center gap-xl">
                            <button onClick={onPrev} disabled={!currentFile} className="btn-icon" title="Previous">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="19 20 9 12 19 4 19 20"></polygon><line x1="5" y1="19" x2="5" y2="5"></line></svg>
                            </button>
                            <button onClick={togglePlay} disabled={!currentFile} className="btn-icon-large" title={isPlaying ? "Pause" : "Play"}>
                                {isPlaying ? (
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" stroke="none"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
                                ) : (
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M5 3l14 9-14 9V3z" /></svg>
                                )}
                            </button>
                            <button onClick={onNext} disabled={!currentFile} className="btn-icon" title="Next">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" y1="5" x2="19" y2="19"></line></svg>
                            </button>
                        </div>

                        {/* Empty Right Side */}
                        <div style={{ justifySelf: 'end', width: '80px' }}></div>
                    </div>
                </div>
                <audio
                    ref={audioRef}
                    onTimeUpdate={() => audioRef.current && setCurrentTime(audioRef.current.currentTime)}
                    onLoadedMetadata={() => audioRef.current && setDuration(audioRef.current.duration)}
                    onEnded={onEnded}
                    crossOrigin="anonymous"
                />
            </DraggableCard>

            {/* 2. Upload Card (Bottom-Left: 35%) */}
            <DraggableCard
                title={translations.upload}
                initialPos={{ x: '16px', y: 'calc(65% + 8px)' }}
                initialSize={{ width: 'calc(70% - 24px)', height: 'calc(35% - 24px)' }}
                className="upload-card"
            >
                <div {...dragHandlers} style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '2px dashed var(--border-color)', borderRadius: 'var(--radius-md)', background: 'rgba(0,0,0,0.2)' }} onClick={onUploadClick}>
                    <h3 style={{ margin: '0', color: 'var(--text-main)', fontSize: '1.1rem' }}>
                        {translations.upload || "Upload Audio"}
                    </h3>
                    <p style={{ margin: '0.5rem 0 0 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        Drag & drop files or click to browse
                    </p>
                </div>
            </DraggableCard>

            {/* 3. Playlist Card (Sidebar: 30%) */}
            <DraggableCard
                title={translations.playlist}
                initialPos={{ x: 'calc(70% + 8px)', y: '16px' }}
                initialSize={{ width: 'calc(30% - 24px)', height: 'calc(100% - 32px)' }}
                className="playlist-card"
            >
                <Playlist
                    files={files}
                    currentFileIndex={currentFileIndex}
                    onPlay={playFile}
                    onReorder={onReorder}
                    onDelete={handleDelete}
                    onClearAll={handleClearAll}
                    translations={translations}
                />
            </DraggableCard>
        </>
    );

    const renderSynthMode = () => (
        <>
            {/* Visualizer Card (Left Side) */}
            <DraggableCard
                title={translations.visualizer || "Visualizer"}
                initialPos={{ x: '20px', y: '20px' }}
                initialSize={{ width: 'calc(50% - 30px)', height: '400px' }}
                className="synth-visualizer-card"
            >
                <div className="visualizer-container" style={{ width: '100%', height: '100%', background: '#000', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Visualizer analyser={analyserNode} isPlaying={isSynthPlaying} />
                </div>
            </DraggableCard>

            {/* Controls Card (Right Side) */}
            <DraggableCard
                title={translations.synthesizer}
                initialPos={{ x: '50%', y: '20px' }}
                initialSize={{ width: 'calc(50% - 30px)', height: '350px' }}
                className="synth-controls-card"
            >
                <SynthControls
                    frequency={frequency}
                    setFrequency={setFrequency}
                    waveform={waveform}
                    setWaveform={setWaveform}
                    volume={volume}
                    onVolumeChange={handleVolumeChange}
                    isPlaying={isSynthPlaying}
                    onStart={() => setIsSynthPlaying(true)}
                    onStop={() => setIsSynthPlaying(false)}
                    translations={translations}
                />
            </DraggableCard>

            {/* Animation Card 1 (Bottom Left - Ground) */}
            <DraggableCard
                initialPos={{ x: '20px', y: '440px' }}
                initialSize={{ width: 'calc(50% - 30px)', height: '150px' }}
                className="synth-anim-card-1"
            >
                <SynthAnimation isPlaying={isSynthPlaying} mode="ground" delay={0} />
            </DraggableCard>

            {/* Animation Card 2 (Bottom Right - Bridge) */}
            <DraggableCard
                initialPos={{ x: '50%', y: '390px' }}
                initialSize={{ width: 'calc(50% - 30px)', height: '200px' }}
                className="synth-anim-card-2"
            >
                <SynthAnimation isPlaying={isSynthPlaying} mode="bridge" delay={2} /> {/* Assuming 4s duration, delay 2s for half cycle overlap if continuous? Or check SynthAnimation logic */}
            </DraggableCard>
        </>
    );

    const renderStaveMode = () => (
        <>
            {/* Card 1: Stave Input (Top Left) */}
            <DraggableCard
                title={translations.staveInput}
                initialPos={{ x: '16px', y: '16px' }}
                initialSize={{ width: '480px', height: '460px' }}
                className="stave-editor-card"
            >
                <StaveInput
                    melody={melody}
                    setMelody={setMelody}
                    onPlay={playMelody}
                    isPlaying={isStavePlaying}
                    translations={translations}
                />
            </DraggableCard>

            {/* Card 2: Animation (Bottom Left, beneath Stave Input) */}
            <DraggableCard
                initialPos={{ x: '16px', y: '492px' }}
                initialSize={{ width: '1030px', height: '110px' }}
                className="stave-animation-card"
                hideHeader={true}
            >
                <div style={{
                    width: '100%',
                    height: '100%',
                    background: '#18181b', // Dark background
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <StaveVisualizer melody={melody} isPlaying={isStavePlaying} currentNoteIndex={currentNoteIndex} />
                </div>
            </DraggableCard>

            {/* Card 3: Visualizer & Controls (Center, between left and right) */}
            <DraggableCard
                title={translations.controls || "Controls"}
                initialPos={{ x: '516px', y: '16px' }}
                initialSize={{ width: '532px', height: '460px' }}
                className="stave-visualizer-controls-card"
            >
                <div className="visualizer-container" style={{ width: '100%', height: '60%', background: '#000', marginBottom: '1rem', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Visualizer analyser={analyserNode} isPlaying={isStavePlaying} />
                </div>
                <StaveControls
                    onPlay={playMelody}
                    isPlaying={isStavePlaying}
                    onClear={() => setMelody([])}
                    melody={melody}
                    translations={translations}
                    volume={volume}
                    onVolumeChange={setVolume}
                />
            </DraggableCard>

            {/* Card 4: Melody Table (Right) */}
            <DraggableCard
                title={translations.melody || "Melody"}
                initialPos={{ x: 'calc(100% - 470px)', y: '16px' }}
                initialSize={{ width: '450px', height: 'calc(100% - 26px)' }}
                className="stave-table-card"
            >
                <MelodyTable
                    melody={melody}
                    onDelete={(id) => setMelody(melody.filter(n => n.id !== id))}
                    onReorder={setMelody}
                    translations={translations}
                    currentNoteIndex={currentNoteIndex}
                />
            </DraggableCard>
        </>
    );

    return (
        <div className="audio-player-container" style={{ width: '100%', height: '100%', position: 'relative' }}>
            {mode === 'player' && renderPlayerMode()}
            {mode === 'synth' && renderSynthMode()}
            {mode === 'stave' && renderStaveMode()}
        </div>
    );
};

export default AudioPlayer;
