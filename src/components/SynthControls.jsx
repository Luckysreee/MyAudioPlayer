import React from 'react';

const SynthControls = ({
    frequency,
    setFrequency,
    waveform,
    setWaveform,
    isPlaying,
    onStart,
    onStop,
    translations
}) => {
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
                        className="slider"
                    />
                </div>
            )}

            <div className="flex-center mt-4">
                {!isPlaying ? (
                    <button onClick={onStart} className="btn-primary">▶</button>
                ) : (
                    <button onClick={onStop} className="btn-primary" style={{ boxShadow: '0 0 20px rgba(255, 68, 68, 0.4)', background: 'var(--error)' }}>⏹</button>
                )}
            </div>
            <p style={{ textAlign: 'center', marginTop: '1rem', opacity: 0.7 }}>
                {isPlaying ? translations.stopSound : translations.startSound}
            </p>
        </div>
    );
};

export default SynthControls;
