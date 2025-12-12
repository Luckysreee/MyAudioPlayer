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
        <div className="synth-controls" style={{ display: 'flex' }}>
            <div className="control-group">
                <label>{translations.waveform}</label>
                <select value={waveform} onChange={handleWaveformChange}>
                    <option value="sine">Sine</option>
                    <option value="square">Square</option>
                    <option value="sawtooth">Sawtooth</option>
                    <option value="triangle">Triangle</option>
                    <option value="white-noise">{translations.whiteNoise || "White Noise"}</option>
                    <option value="pink-noise">{translations.pinkNoise || "Pink Noise"}</option>
                </select>
            </div>

            {!isNoise && (
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
            )}

            <div className="buttons">
                {!isPlaying ? (
                    <button onClick={onStart}>{translations.startSound}</button>
                ) : (
                    <button onClick={onStop} className="stop-btn">{translations.stopSound}</button>
                )}
            </div>
        </div>
    );
};

export default SynthControls;
