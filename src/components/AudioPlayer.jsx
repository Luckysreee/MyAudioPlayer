import React, { useRef, useState, useEffect } from 'react';
import Visualizer from './Visualizer';
import SynthControls from './SynthControls';
import StaveInput from './StaveInput';
import Playlist from './Playlist';
import DraggableCard from './DraggableCard';

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
    dragHandlers
}) => {

    // Audio Context & State (SAME AS BEFORE)
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const audioRef = useRef(null);
    const sourceRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const oscillatorRef = useRef(null);
    const gainNodeRef = useRef(null);
    const [frequency, setFrequency] = useState(440);
    const [waveform, setWaveform] = useState('sine');
    const [isSynthPlaying, setIsSynthPlaying] = useState(false);

    const [melody, setMelody] = useState([]);
    const [isStavePlaying, setIsStavePlaying] = useState(false);
    const staveNodesRef = useRef([]);

    const [volume, setVolume] = useState(0.5);
    const [analyserNode, setAnalyserNode] = useState(null);

    // Initializer
    useEffect(() => {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioContext();
        audioContextRef.current = ctx;
        const analyser = ctx.createAnalyser();
        analyser.connect(ctx.destination);
        analyserRef.current = analyser;
        setAnalyserNode(analyser);
        return () => ctx.close();
    }, []);

    // Mode Helper
    useEffect(() => {
        if (mode !== 'player' && audioRef.current) {
            audioRef.current.pause();
            setIsPlaying(false);
        }
        if (mode !== 'synth' && isSynthPlaying) stopSynth();
        if (mode !== 'stave' && isStavePlaying) stopStave();
    }, [mode, isSynthPlaying, isStavePlaying]);

    // Player Hooks
    useEffect(() => {
        if (mode === 'player' && !currentFile) { handleStop(); return; }
        if (mode === 'player' && currentFile && audioRef.current && audioContextRef.current) {
            const url = URL.createObjectURL(currentFile);
            audioRef.current.src = url;
            if (!sourceRef.current) {
                try {
                    const source = audioContextRef.current.createMediaElementSource(audioRef.current);
                    source.connect(analyserRef.current);
                    sourceRef.current = source;
                } catch (e) { }
            }
            audioRef.current.play().then(() => setIsPlaying(true)).catch(e => console.error(e));
            return () => { URL.revokeObjectURL(url); setIsPlaying(false); };
        }
    }, [currentFile, mode]);

    const togglePlay = () => {
        if (!audioRef.current || !currentFile) return;
        if (audioContextRef.current.state === 'suspended') audioContextRef.current.resume();
        if (isPlaying) audioRef.current.pause(); else audioRef.current.play();
        setIsPlaying(!isPlaying);
    };

    const handleStop = () => {
        if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; }
        setIsPlaying(false);
    };

    // Synth/Stave Functions (simplified reuse)
    const createNoiseBuffer = (type) => {
        const ctx = audioContextRef.current;
        // ... (Logic same as before, truncated for brevity, will paste full logic if needed but user wants exact match. I'll paste the full functions.)
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = buffer.getChannelData(0);
        if (type === 'pink-noise') {
            let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
            for (let i = 0; i < bufferSize; i++) {
                const w = Math.random() * 2 - 1;
                b0 = 0.99886 * b0 + w * 0.0555179; b1 = 0.99332 * b1 + w * 0.0750759; b2 = 0.96900 * b2 + w * 0.1538520;
                b3 = 0.86650 * b3 + w * 0.3104856; b4 = 0.55000 * b4 + w * 0.5329522; b5 = -0.7616 * b5 - w * 0.0168980;
                output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362; output[i] *= 0.11; b6 = w * 0.115926;
            }
        } else { for (let i = 0; i < bufferSize; i++) output[i] = Math.random() * 2 - 1; }
        return buffer;
    };

    const startSynth = () => {
        if (audioContextRef.current.state === 'suspended') audioContextRef.current.resume();
        const ctx = audioContextRef.current;
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(volume, ctx.currentTime);
        gain.connect(analyserRef.current);
        gainNodeRef.current = gain;
        let source;
        if (waveform.includes('noise')) {
            source = ctx.createBufferSource(); source.buffer = createNoiseBuffer(waveform); source.loop = true;
        } else {
            source = ctx.createOscillator(); source.type = waveform; source.frequency.setValueAtTime(frequency, ctx.currentTime);
        }
        source.connect(gain); source.start();
        oscillatorRef.current = source;
        setIsSynthPlaying(true);
    };

    const stopSynth = () => {
        if (oscillatorRef.current) { try { oscillatorRef.current.stop(); oscillatorRef.current.disconnect(); } catch (e) { } }
        if (gainNodeRef.current) try { gainNodeRef.current.disconnect(); } catch (e) { }
        setIsSynthPlaying(false);
    };

    const playStave = () => {
        if (isStavePlaying) { stopStave(); return; }
        if (melody.length === 0) return;
        if (audioContextRef.current.state === 'suspended') audioContextRef.current.resume();
        const ctx = audioContextRef.current;
        const now = ctx.currentTime;
        let t = now;
        const nodes = [];
        melody.forEach(m => {
            const full = m.note + (m.accidental || '');
            const noteMap = { 'C': -9, 'C#': -8, 'D': -7, 'D#': -6, 'E': -5, 'F': -4, 'F#': -3, 'G': -2, 'G#': -1, 'A': 0, 'A#': 1, 'B': 2 };
            const semi = noteMap[full];
            if (semi === undefined) return;
            const freq = 440 * Math.pow(2, (semi + (m.octave - 4) * 12) / 12);
            const osc = ctx.createOscillator(); const g = ctx.createGain();
            osc.type = 'sine'; osc.frequency.value = freq;
            osc.connect(g); g.connect(analyserRef.current);
            osc.start(t);
            g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(volume, t + 0.05);
            g.gain.setValueAtTime(volume, t + m.duration - 0.05); g.gain.linearRampToValueAtTime(0, t + m.duration);
            osc.stop(t + m.duration);
            nodes.push({ osc, g });
            t += m.duration;
        });
        staveNodesRef.current = nodes;
        setIsStavePlaying(true);
        setTimeout(() => { setIsStavePlaying(false); staveNodesRef.current = []; }, (t - now) * 1000);
    };

    const stopStave = () => {
        staveNodesRef.current.forEach(n => { try { n.osc.stop(); n.osc.disconnect(); n.g.disconnect(); } catch (e) { } });
        staveNodesRef.current = [];
        setIsStavePlaying(false);
    };

    const handleVolumeChange = (e) => {
        const vol = Number(e.target.value);
        setVolume(vol);
        if (audioRef.current) audioRef.current.volume = vol;
        if (gainNodeRef.current) gainNodeRef.current.gain.setValueAtTime(vol, audioContextRef.current.currentTime);
    };

    const formatTime = (time) => {
        if (isNaN(time)) return "0:00";
        const m = Math.floor(time / 60);
        const s = Math.floor(time % 60);
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    // RENDER w/ DRAGGABLE CARDS

    // PLAYER MODE
    const renderPlayerMode = () => (
        <>
            <DraggableCard title={translations.player} initialPos={{ x: 50, y: 50 }} className="left-panel">
                <div {...dragHandlers}>
                    <div className="visualizer-container mb-4">
                        <Visualizer analyser={analyserNode} isPlaying={isPlaying} />
                    </div>

                    <h2 style={{ fontSize: '1.1rem', marginBottom: '1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {currentFile ? currentFile.name : translations.noFileSelected}
                    </h2>

                    <audio
                        ref={audioRef}
                        onTimeUpdate={() => audioRef.current && setCurrentTime(audioRef.current.currentTime)}
                        onLoadedMetadata={() => audioRef.current && setDuration(audioRef.current.duration)}
                        onEnded={onEnded}
                        crossOrigin="anonymous"
                    />

                    <div style={{ marginTop: 'auto' }}>
                        <div className="flex-between" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            <span>{formatTime(currentTime)}</span>
                            <span>{formatTime(duration)}</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max={duration || 0}
                            value={currentTime}
                            onChange={(e) => {
                                const time = Number(e.target.value);
                                if (audioRef.current) { audioRef.current.currentTime = time; setCurrentTime(time); }
                            }}
                        />

                        <div className="flex-center gap-md mt-4">
                            <button onClick={onPrev} disabled={!currentFile} className="btn-secondary">⏮</button>
                            <button onClick={togglePlay} disabled={!currentFile} className="btn-primary">
                                {isPlaying ? '⏸' : '▶'}
                            </button>
                            <button onClick={onNext} disabled={!currentFile} className="btn-secondary">⏭</button>
                        </div>
                        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                            <button onClick={handleStop} disabled={!currentFile} className="btn-secondary" style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}>
                                ⏹ {translations.reset || "Param"}
                            </button>
                        </div>
                    </div>
                </div>
            </DraggableCard>

            <DraggableCard title={translations.playlist} initialPos={{ x: 450, y: 50 }} className="right-panel">
                <Playlist
                    files={files}
                    currentFileIndex={currentFileIndex}
                    onPlay={playFile}
                    onReorder={() => { }}
                    onDelete={handleDelete}
                    onClearAll={handleClearAll}
                    translations={translations}
                />
            </DraggableCard>
        </>
    );

    // SYNTH MODE
    const renderSynthMode = () => (
        <>
            <DraggableCard title={translations.synthesizer} initialPos={{ x: 50, y: 50 }} className="left-panel">
                <SynthControls
                    frequency={frequency}
                    setFrequency={setFrequency}
                    waveform={waveform}
                    setWaveform={setWaveform}
                    volume={volume}
                    onVolumeChange={handleVolumeChange} // WIRED
                    isPlaying={isSynthPlaying}
                    onStart={startSynth}
                    onStop={stopSynth}
                    translations={translations}
                />
            </DraggableCard>
            <DraggableCard title="Visualizer" initialPos={{ x: 450, y: 50 }} className="right-panel">
                <div className="flex-center" style={{ background: '#000', borderRadius: '4px', overflow: 'hidden' }}>
                    <Visualizer analyser={analyserNode} isPlaying={isSynthPlaying} />
                </div>
            </DraggableCard>
        </>
    );

    // STAVE MODE
    const renderStaveMode = () => (
        <>
            <DraggableCard title={translations.staveInput} initialPos={{ x: 100, y: 50 }} className="wide-card">
                <StaveInput
                    melody={melody}
                    setMelody={setMelody}
                    onPlay={playStave}
                    isPlaying={isStavePlaying}
                    translations={translations}
                />
            </DraggableCard>
        </>
    );

    return (
        <>
            {mode === 'player' && renderPlayerMode()}
            {mode === 'synth' && renderSynthMode()}
            {mode === 'stave' && renderStaveMode()}
        </>
    );
};

export default AudioPlayer;
