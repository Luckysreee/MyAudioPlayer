import React from 'react';

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
    // ...
    <div className="mb-4">
        <div className="flex-between">
            <label>{translations.volume || "Volume"}</label>
            <span>{Math.round(volume * 100)}%</span>
        </div>
        <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={onVolumeChange}
        />
    </div>
    const isNoise = waveform === 'white-noise' || waveform === 'pink-noise';

    const handleWaveformChange = (e) => {
        setWaveform(e.target.value);
    };

    const handleFrequencyChange = (e) => {
        setFrequency(Number(e.target.value));
    };

    return (
        <div className="synth-controls-wrapper">
            <div className="flex-between mb-4">
                <label className="text-large">{translations.waveform}</label>
                <select value={waveform} onChange={handleWaveformChange} style={{ maxWidth: '200px' }}>
                    <option value="sine">Sine</option>
                    <option value="square">Square</option>
                    <option value="sawtooth">Sawtooth</option>
                    <option value="triangle">Triangle</option>
                    <option value="white-noise">{translations.whiteNoise || "White Noise"}</option>
                    <option value="pink-noise">{translations.pinkNoise || "Pink Noise"}</option>
                </select>
            </div>

            {!isNoise && (
                <div className="mb-4">
                    <div className="flex-between">
                        <label>{translations.frequency}</label>
                        <span>{frequency} Hz</span>
                    </div>
                    <input
                        type="range"
                        min="50"
                        max="2000"
                        value={frequency}
                        onChange={handleFrequencyChange}
                    />
                </div>
            )}

            <div className="mb-4">
                <div className="flex-between">
                    <label>{translations.volume || "Volume"}</label>
                    <span>{Math.round(volume * 100)}%</span>
                </div>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={onVolumeChange}
                />
            </div>

            <div className="flex-center mt-4">
                {!isPlaying ? (
                    <button onClick={onStart} className="btn-primary">▶</button>
                ) : (
                    <button onClick={onStop} className="btn-primary" style={{ background: 'var(--danger)', borderColor: 'var(--danger)' }}>⏹</button>
                )}
            </div>
            <p style={{ textAlign: 'center', marginTop: '1rem', opacity: 0.7 }}>
                {isPlaying ? translations.stopSound : translations.startSound}
            </p>
        </div>
    );
};

export default SynthControls;
