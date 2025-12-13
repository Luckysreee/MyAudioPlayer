import React, { useEffect, useState } from 'react';

const SynthGear = ({ isPlaying, mode = 'ground', animationDuration = 4 }) => {
    // Mode: 'ground' (flat) or 'bridge' (raised with spikes)

    // We can use CSS animations. 
    // The gear should roll from left to right.
    // Ideally, for 2 cards, we want the animation to synchronize.
    // Card 1 (Ground) -> Card 2 (Bridge).

    // If we use a simple delay, it might drift. 
    // But for a visual effect, a delay equal to half the cycle time (if 2 cards cover the loop) is fine.
    // Or we just animate based on isPlaying.

    // Let's assume the "Total Path" is split across 2 cards.
    // But they are separate components. 
    // We can make the gear move 0% -> 100% in Card 1, then wait, then 0% -> 100% in Card 2?
    // Or simpler: Continuous loop on both, but Card 2's loop is offset.

    return (
        <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', background: mode === 'bridge' ? '#1a1a1a' : '#222' }}>

            {/* Terrain Drawing */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '20px', background: '#4CAF50' }}></div>

            {mode === 'bridge' && (
                <>
                    {/* Bridge structure */}
                    <div style={{ position: 'absolute', bottom: '20px', left: '0', width: '100%', height: '40px', background: '#555', zIndex: 1 }}></div>
                    {/* Spikes under existing bridge (or just decor) */}
                    <div style={{ position: 'absolute', bottom: '10px', left: '20%', width: '0', height: '0', borderLeft: '10px solid transparent', borderRight: '10px solid transparent', borderBottom: '20px solid red', zIndex: 0 }}></div>
                    <div style={{ position: 'absolute', bottom: '10px', left: '50%', width: '0', height: '0', borderLeft: '10px solid transparent', borderRight: '10px solid transparent', borderBottom: '20px solid red', zIndex: 0 }}></div>
                    <div style={{ position: 'absolute', bottom: '10px', left: '80%', width: '0', height: '0', borderLeft: '10px solid transparent', borderRight: '10px solid transparent', borderBottom: '20px solid red', zIndex: 0 }}></div>
                </>
            )}

            {/* The Gear/Cartwheel */}
            <div
                className="gear-boy"
                style={{
                    position: 'absolute',
                    bottom: mode === 'bridge' ? '60px' : '20px', // On ground or on bridge
                    left: '-50px', // Start off-screen
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, #FFC107 40%, transparent 40%), conic-gradient(#FFC107 0 25%, transparent 0 50%, #FFC107 0 75%, transparent 0)',
                    border: '4px solid #FF9800',
                    animation: isPlaying
                        ? `roll across ${animationDuration}s linear infinite`
                        : 'none',
                    animationDelay: mode === 'bridge' ? `${animationDuration / 2}s` : '0s' // Offset for second card
                }}
            >
                {/* Spokes or "Boy" representation (abstract) */}
                <div style={{ position: 'absolute', top: '50%', left: '50%', width: '100%', height: '4px', background: '#FF9800', transform: 'translate(-50%, -50%)' }}></div>
                <div style={{ position: 'absolute', top: '50%', left: '50%', width: '100%', height: '4px', background: '#FF9800', transform: 'translate(-50%, -50%) rotate(90deg)' }}></div>
            </div>

            <style>{`
                @keyframes roll {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                @keyframes across {
                    0% { left: -60px; transform: rotate(0deg); }
                    45% { left: 110%; transform: rotate(360deg); } /* Move across in first half of cycle */
                    100% { left: 110%; transform: rotate(360deg); } /* Stay off-screen for rest */
                }
            `}</style>
        </div>
    );
};

export default SynthGear;
