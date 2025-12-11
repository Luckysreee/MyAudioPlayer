import React, { useRef, useState, useEffect } from 'react';
import Visualizer from './Visualizer';

const AudioPlayer = ({ currentFile, onEnded, onNext, onPrev, translations }) => {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);

    useEffect(() => {
        if (currentFile && audioRef.current) {
            // Create an object URL only if it's a File object (from input)
            // If it were a string URL we would use it directly.
            // Assuming currentFile is a File object here.
            const url = URL.createObjectURL(currentFile);
            audioRef.current.src = url;
            audioRef.current.play()
                .then(() => setIsPlaying(true))
                .catch(e => console.error("Playback failed", e));

            return () => {
                URL.revokeObjectURL(url);
                setIsPlaying(false);
            };
        }
    }, [currentFile]);

    const togglePlay = () => {
        if (!audioRef.current) return;
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

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    const handleSeek = (e) => {
        const time = Number(e.target.value);
        if (audioRef.current) {
            audioRef.current.currentTime = time;
            setCurrentTime(time);
        }
    };

    const handleVolumeChange = (e) => {
        const vol = Number(e.target.value);
        if (audioRef.current) {
            audioRef.current.volume = vol;
            setVolume(vol);
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
            <h2>{currentFile ? currentFile.name : translations.noFileSelected}</h2>

            <Visualizer audioRef={audioRef} isPlaying={isPlaying} />

            <audio
                ref={audioRef}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={onEnded}
            />

            <div className="controls">
                <label htmlFor="seek-bar" style={{ display: 'none' }}>Seek Bar</label>
                <input
                    id="seek-bar"
                    type="range"
                    min="0"
                    max={duration || 0}
                    value={currentTime}
                    onChange={handleSeek}
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

                <div className="volume-control">
                    <label htmlFor="volume-slider">{translations.volume}</label>
                    <input
                        id="volume-slider"
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={handleVolumeChange}
                    />
                </div>
            </div>
        </div>
    );
};

export default AudioPlayer;
