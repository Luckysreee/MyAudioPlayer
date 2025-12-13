import React from 'react';

const SynthAnimation = ({ isPlaying, mode = 'ground', animationDuration = 8 }) => {

    return (
        <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>

            {/* Background: Starry Night (Restored v2) */}
            <div style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                background: 'linear-gradient(to bottom, #0d1b2a 0%, #1b263b 60%, #415a77 100%)',
                zIndex: 0
            }}>
                <div style={{ position: 'absolute', top: '20%', left: '20%', width: '2px', height: '2px', background: '#fff', opacity: 0.8 }}></div>
                <div style={{ position: 'absolute', top: '10%', left: '80%', width: '2px', height: '2px', background: '#fff', opacity: 0.6 }}></div>
                <div style={{ position: 'absolute', top: '40%', left: '50%', width: '1px', height: '1px', background: '#fff', opacity: 0.9 }}></div>
            </div>

            {/* Terrain (Restored v2) */}
            {mode === 'ground' ? (
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
                <>
                    <div style={{
                        position: 'absolute', bottom: '30px', left: 0, width: '100%', height: '40px',
                        background: 'repeating-linear-gradient(90deg, #3e2723 0, #3e2723 10px, #4e342e 10px, #4e342e 20px)', // Wood texture
                        borderTop: '4px solid #5d4037',
                        zIndex: 1
                    }}></div>

                    {/* Realistic Spikes (Metallic) */}
                    <div style={{ position: 'absolute', bottom: '0', left: '0', width: '100%', height: '30px', display: 'flex', justifyContent: 'space-around', zIndex: 0 }}>
                        {[...Array(8)].map((_, i) => (
                            <div key={i} style={{
                                width: '20px', height: '30px',
                                background: 'linear-gradient(to right, #78909c, #cfd8dc, #78909c)', // Metallic Gradient
                                clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)', // Triangle Shape
                            }}></div>
                        ))}
                    </div>
                </>
            )}

            {/* PIXEL PERSON (Restored v1 - Blocky) */}
            <div
                className={`pixel-walker walker-${mode}`}
                style={{
                    position: 'absolute',
                    bottom: mode === 'bridge' ? '70px' : '30px',
                    left: '-50px',
                    width: '30px',
                    height: '50px',
                    zIndex: 2,
                    animation: isPlaying
                        ? (mode === 'ground'
                            ? `walkGround ${animationDuration}s linear infinite`
                            : `walkBridge ${animationDuration}s linear infinite`)
                        : 'none',
                }}
            >
                {/* HEAD (Block) */}
                <div style={{
                    position: 'absolute', top: '0', left: '5px', width: '20px', height: '20px', background: '#FFCC80', borderRadius: '4px'
                }}></div>
                {/* BODY (Block) */}
                <div style={{
                    position: 'absolute', top: '20px', left: '5px', width: '20px', height: '15px', background: '#1976D2'
                }}></div>
                {/* ARM (Block) */}
                <div style={{
                    position: 'absolute', top: '22px', left: '10px', width: '10px', height: '10px', background: '#FFCC80',
                    animation: isPlaying ? 'armSwing 0.5s infinite alternate' : 'none'
                }}></div>

                {/* LEGS (Blocky) */}
                <div style={{
                    position: 'absolute', top: '35px', left: '5px', width: '8px', height: '15px', background: '#333',
                    transformOrigin: 'top',
                    animation: isPlaying ? 'walkLeg 0.5s infinite alternate' : 'none'
                }}></div>
                <div style={{
                    position: 'absolute', top: '35px', left: '17px', width: '8px', height: '15px', background: '#333',
                    transformOrigin: 'top',
                    animation: isPlaying ? 'walkLeg 0.5s infinite alternate-reverse' : 'none'
                }}></div>

            </div>

            <style>{`
                @keyframes walkGround {
                    0% { left: -50px; opacity: 1; }
                    48% { left: 110%; opacity: 1; }
                    48.01% { opacity: 0; }
                    100% { opacity: 0; }
                }

                @keyframes walkBridge {
                    0% { opacity: 0; left: -50px; }
                    50% { opacity: 0; left: -50px; }
                    50.01% { opacity: 1; left: -50px; }
                    98% { left: 110%; opacity: 1; }
                    100% { left: 110%; opacity: 0; }
                }

                @keyframes walkLeg {
                    from { transform: rotate(-30deg); }
                    to { transform: rotate(30deg); }
                }
                 @keyframes armSwing {
                    from { transform: translateX(-5px); }
                    to { transform: translateX(5px); }
                }
            `}</style>
        </div>
    );
};

export default SynthAnimation;
