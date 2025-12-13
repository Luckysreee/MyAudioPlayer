import React from 'react';

const SynthAnimation = ({ isPlaying, mode = 'ground', animationDuration = 8 }) => {
    // Mode: 'ground' (Leafy/Green) or 'bridge' (Stone/Spikes)
    // Sequential Logic: 
    // Cycle = 8s.
    // Ground: Walk 0-4s (0-50%).
    // Bridge: Walk 4-8s (50-100%).

    return (
        <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>

            {/* Background: Sky Gradient */}
            <div style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                background: 'linear-gradient(to bottom, #0d1b2a 0%, #1b263b 60%, #415a77 100%)',
                zIndex: 0
            }}>
                {/* Stars */}
                <div style={{ position: 'absolute', top: '20%', left: '20%', width: '2px', height: '2px', background: '#fff', opacity: 0.8 }}></div>
                <div style={{ position: 'absolute', top: '10%', left: '80%', width: '2px', height: '2px', background: '#fff', opacity: 0.6 }}></div>
                <div style={{ position: 'absolute', top: '40%', left: '50%', width: '1px', height: '1px', background: '#fff', opacity: 0.9 }}></div>
            </div>

            {/* Terrain */}
            {mode === 'ground' ? (
                // Ground Terrain
                <div style={{
                    position: 'absolute', bottom: 0, left: 0, width: '100%', height: '30px',
                    background: 'linear-gradient(to bottom, #2e7d32 0%, #1b5e20 100%)', // Realistic Green
                    borderTop: '2px solid #4caf50',
                    zIndex: 1
                }}>
                    {/* Grass details */}
                    {[...Array(10)].map((_, i) => (
                        <div key={i} style={{
                            position: 'absolute', bottom: '30px', left: `${i * 10 + 5}%`,
                            width: '2px', height: '6px', background: '#4caf50'
                        }}></div>
                    ))}
                </div>
            ) : (
                // Bridge Terrain
                <>
                    <div style={{
                        position: 'absolute', bottom: '30px', left: 0, width: '100%', height: '40px',
                        background: 'repeating-linear-gradient(90deg, #3e2723 0, #3e2723 10px, #4e342e 10px, #4e342e 20px)', // Wood/Stone texture
                        borderTop: '4px solid #5d4037',
                        zIndex: 1
                    }}></div>
                    {/* Spikes Underneath */}
                    <div style={{ position: 'absolute', bottom: '0', left: '0', width: '100%', height: '30px', display: 'flex', justifyContent: 'space-around', zIndex: 0 }}>
                        {[...Array(8)].map((_, i) => (
                            <div key={i} style={{
                                width: '0', height: '0',
                                borderLeft: '10px solid transparent', borderRight: '10px solid transparent',
                                borderBottom: '30px solid #b71c1c'
                            }}></div>
                        ))}
                    </div>
                </>
            )}

            {/* Walking Person Container */}
            <div
                className={`realistic-walker walker-${mode}`}
                style={{
                    position: 'absolute',
                    bottom: mode === 'bridge' ? '70px' : '30px', // Adjust for terrain height
                    left: '-50px',
                    width: '30px',
                    height: '60px',
                    zIndex: 2,
                    animation: isPlaying
                        ? (mode === 'ground'
                            ? `walkGround ${animationDuration}s linear infinite`
                            : `walkBridge ${animationDuration}s linear infinite`)
                        : 'none',
                }}
            >
                {/* SVG Character (Simple Silhouette for realism/style) */}
                <svg width="30" height="60" viewBox="0 0 30 60" fill="none">
                    {/* Head */}
                    <circle cx="15" cy="10" r="8" fill="#ffb74d" />
                    {/* Body */}
                    <rect x="10" y="18" width="10" height="25" fill="#1565c0" rx="2" />
                    {/* Arms (Animated via CSS in SVG not easy, so use separate divs for limbs if possible, or just SVG group) */}
                </svg>

                {/* Dynamic Limbs (Divs for easy CSS animation) */}
                {/* Left Leg */}
                <div style={{
                    position: 'absolute', top: '40px', left: '8px', width: '6px', height: '20px', background: '#333',
                    transformOrigin: 'top',
                    animation: isPlaying ? 'legMove 0.8s infinite alternate' : 'none',
                    borderRadius: '2px'
                }}></div>
                {/* Right Leg */}
                <div style={{
                    position: 'absolute', top: '40px', left: '16px', width: '6px', height: '20px', background: '#333',
                    transformOrigin: 'top',
                    animation: isPlaying ? 'legMove 0.8s infinite alternate-reverse' : 'none',
                    borderRadius: '2px'
                }}></div>
                {/* Arm */}
                <div style={{
                    position: 'absolute', top: '20px', left: '12px', width: '6px', height: '18px', background: '#ffb74d',
                    transformOrigin: 'top',
                    borderRadius: '2px',
                    animation: isPlaying ? 'armMove 0.8s infinite alternate' : 'none'
                }}></div>

            </div>

            <style>{`
                /* Keyframes for Sequential Movement */
                @keyframes walkGround {
                    0% { left: -50px; opacity: 1; }
                    48% { left: 110%; opacity: 1; }
                    48.01% { opacity: 0; }
                    100% { opacity: 0; }
                }

                @keyframes walkBridge {
                    0% { opacity: 0; left: -50px; }
                    50% { opacity: 0; left: -50px; } /* Wait for Ground cycle */
                    50.01% { opacity: 1; left: -50px; } /* Start */
                    98% { left: 110%; opacity: 1; }
                    100% { left: 110%; opacity: 0; } /* Reset */
                }

                @keyframes legMove {
                    from { transform: rotate(-25deg); }
                    to { transform: rotate(25deg); }
                }
                @keyframes armMove {
                    from { transform: rotate(20deg); }
                    to { transform: rotate(-20deg); }
                }
            `}</style>
        </div>
    );
};

export default SynthAnimation;
