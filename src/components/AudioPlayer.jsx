import React, { useRef, useState, useEffect } from 'react';
import Visualizer from './Visualizer';

const AudioPlayer = ({ currentFile, onEnded, onNext, onPrev, translations }) => {
    // Mode State: 'player' or 'synth'
    const [mode, setMode] = useState('player'); // Default to player if file exists?

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
    const oscillatorRef = useRef(null);
    const gainNodeRef = useRef(null);
    const [frequency, setFrequency] = useState(440);
    const [waveform, setWaveform] = useState('sine');
    const [isSynthPlaying, setIsSynthPlaying] = useState(false);

    // Common State
    const [volume, setVolume] = useState(0.5);
    const [isLightTheme, setIsLightTheme] = useState(false);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [analyserNode, setAnalyserNode] = useState(null); // To pass to Visualizer

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
        if (mode === 'player' && currentFile && audioRef.current && audioContextRef.current) {
            const url = URL.createObjectURL(currentFile);
            audioRef.current.src = url;

            // Connect Audio Element to Analyser
            if (!sourceRef.current) {
                try {
                    const source = audioContextRef.current.createMediaElementSource(audioRef.current);
                    source.connect(analyserRef.current);
                    sourceRef.current = source;
                } catch (e) { console.error(e) }
            }

            audioRef.current.play()
                .then(() => setIsPlaying(true))
                .catch(e => console.error("Playback failed", e));

            return () => {
                URL.revokeObjectURL(url);
                setIsPlaying(false);
            };
        } else if (mode === 'synth') {
            // Pause player if switching to synth
            if (audioRef.current) audioRef.current.pause();
            setIsPlaying(false);
        }
    }, [currentFile, mode]);

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (audioContextRef.current.state === 'suspended') audioContextRef.current.resume();

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleStop = () => {
        if (!audioRef.current) return;
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsPlaying(false);
    };

    // -- SYNTH LOGIC --
    const startSynth = () => {
        if (audioContextRef.current.state === 'suspended') audioContextRef.current.resume();

        const ctx = audioContextRef.current;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = waveform;
        osc.frequency.setValueAtTime(frequency, ctx.currentTime);
        gain.gain.setValueAtTime(volume, ctx.currentTime);

        // Connect Synth to Analyser
        osc.connect(gain);
        gain.connect(analyserRef.current);

        osc.start();
        oscillatorRef.current = osc;
        gainNodeRef.current = gain;

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

    const handleFrequencyChange = (e) => {
        const val = Number(e.target.value);
        setFrequency(val);
        if (oscillatorRef.current) {
            oscillatorRef.current.frequency.setValueAtTime(val, audioContextRef.current.currentTime);
        }
    };

    const handleWaveformChange = (e) => {
        const val = e.target.value;
        setWaveform(val);
        if (oscillatorRef.current) {
            oscillatorRef.current.type = val;
        }
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
    };

    const formatTime = (time) => {
        if (isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <div className="card audio-player">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2>{mode === 'player' ? translations.player : translations.synthesizer}</h2>
                <select value={mode} onChange={(e) => {
                    setMode(e.target.value);
                    // Stop everything on switch
                    handleStop();
                    stopSynth();
                }}>
                    <option value="player">{translations.player}</option>
                    <option value="synth">{translations.synthesizer}</option>
                </select>
            </div>

            {/* Shared Visualizer */}
            <Visualizer analyser={analyserNode} isPlaying={isPlaying || isSynthPlaying} />

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
                        <button onClick={handleStop} disabled={!currentFile}>⏹ {translations.stopped}</button>
                        <button onClick={onNext} disabled={!currentFile}>⏭</button>
                    </div>
                </div>
            </div>

            {/* --- SYNTH UI --- */}
            <div className="synth-controls" style={{ display: mode === 'synth' ? 'flex' : 'none' }}>
                <div className="control-group">
                    <label>{translations.waveform}</label>
                    <select value={waveform} onChange={handleWaveformChange}>
                        <option value="sine">Sine</option>
                        <option value="square">Square</option>
                        <option value="sawtooth">Sawtooth</option>
                        <option value="triangle">Triangle</option>
                    </select>
                </div>

                <div className="control-group">
                    <label>{translations.frequency} ({frequency} Hz)</label>
                    <input
                        type="range"
                        min="50"
                        max="2000"
                        value={frequency}
                        onChange={handleFrequencyChange}
                    />
                </div>

                <div className="buttons">
                    {!isSynthPlaying ? (
                        <button onClick={startSynth}>{translations.startSound}</button>
                    ) : (
                        <button onClick={stopSynth} className="stop-btn">{translations.stopSound}</button>
                    )}
                </div>
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
                    />
                </div>
            </div>

        </div>
    );
};

export default AudioPlayer;
