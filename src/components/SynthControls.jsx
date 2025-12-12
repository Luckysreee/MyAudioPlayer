import React, { useRef, useEffect } from 'react';

const SynthControls = ({
    frequency,
    setFrequency,
    waveform,
    setWaveform,
    volume,
    onVolumeChange,
    isPlaying,
    onStart,
    onStop,
    translations
}) => {

    // Canvas ref for potential small visualizer or just decor
    const canvasRef = useRef(null);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* Waveform Selector */}
            <div className="control-group">
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                    {translations.waveform || "Waveform"}
                </label>
                <select
                    value={waveform}
                    onChange={(e) => setWaveform(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '0.5rem',
                        background: 'var(--surface-color)',
                        border: '1px solid var(--primary-color)',
                        borderRadius: '6px',
                        color: 'var(--text-color)',
                        outline: 'none',
                        cursor: 'pointer'
                    }}
                    className="no-drag"
                >
                    <option value="sine">Sine</option>
                    <option value="square">Square</option>
                    <option value="sawtooth">Sawtooth</option>
                    <option value="triangle">Triangle</option>
                    <option value="white-noise">{translations.whiteNoise || "White Noise"}</option>
                    <option value="pink-noise">{translations.pinkNoise || "Pink Noise"}</option>
                </select>
            </div>

            {/* Slider: Frequency (Only for oscillators) */}
            {!waveform.includes('noise') && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div className="flex-between" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                        <label>{translations.frequency || "Frequency"}</label>
                        <span style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>{frequency} Hz</span>
                    </div>
                    <input
                        type="range"
                        min="20"
                        max="2000"
                        value={frequency}
                        onChange={(e) => setFrequency(Number(e.target.value))}
                        className="no-drag"
                        style={{ width: '100%' }}
                    />
                </div>
            )}

            {/* Slider: Volume */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div className="flex-between" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    <label>{translations.volume || "Volume"}</label>
                    <span style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>{Math.round(volume * 100)}%</span>
                </div>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={onVolumeChange}
                    className="no-drag"
                    style={{ width: '100%' }}
                />
            </div>

            {/* Play Button */}
            <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button
                    onClick={isPlaying ? onStop : onStart}
                    className="btn-primary"
                    style={{
                        width: '100%',
                        height: '45px',
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        background: isPlaying ? 'var(--error-color)' : 'var(--surface-color)',
                        borderColor: isPlaying ? 'var(--error-color)' : 'var(--primary-color)',
                        color: isPlaying ? '#fff' : 'var(--primary-color)',
                        boxShadow: isPlaying ? 'none' : '0 0 10px rgba(0,0,0,0.2)'
                    }}
                >
                    {isPlaying ? (translations.stopSound || "Stop Sound") : (translations.startSound || "Start Sound")}
                </button>
            </div>

        </div>
    );
};

export default SynthControls;
