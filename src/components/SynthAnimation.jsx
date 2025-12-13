import React from 'react';

const SynthAnimation = ({ isPlaying, mode = 'ground', animationDuration = 8 }) => {

    return (
        <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>

            {/* Background: Sky Gradient */}
            <div style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                background: 'linear-gradient(to bottom, #0d1b2a 0%, #1b263b 60%, #415a77 100%)',
                zIndex: 0
            }}>
                {/* Stars */}
                <div style={{ position: 'absolute', top: '20%', left: '20%', width: '2px', height: '2px', background: '#fff', opacity: 0.8, borderRadius: '50%' }}></div>
                <div style={{ position: 'absolute', top: '10%', left: '80%', width: '2px', height: '2px', background: '#fff', opacity: 0.6, borderRadius: '50%' }}></div>
                <div style={{ position: 'absolute', top: '40%', left: '50%', width: '1px', height: '1px', background: '#fff', opacity: 0.9, borderRadius: '50%' }}></div>
            </div>

            {/* Terrain */}
            {mode === 'ground' ? (
                <div style={{
                    position: 'absolute', bottom: 0, left: 0, width: '100%', height: '30px',
                    background: 'linear-gradient(to bottom, #66bb6a 0%, #2e7d32 100%)', // Brighter, cuter green
                    borderTop: '3px solid #81c784',
                    zIndex: 1
                }}></div>
            ) : (
                <>
                    <div style={{
                        position: 'absolute', bottom: '30px', left: 0, width: '100%', height: '40px',
                        background: '#795548', // Brown wood
                        borderTop: '4px solid #8d6e63',
                        zIndex: 1
                    }}></div>
                    {/* Soft Spikes */}
                    <div style={{ position: 'absolute', bottom: '0', left: '0', width: '100%', height: '30px', display: 'flex', justifyContent: 'space-around', zIndex: 0 }}>
                        {[...Array(8)].map((_, i) => (
                            <div key={i} style={{
                                width: '0', height: '0',
                                borderLeft: '10px solid transparent', borderRight: '10px solid transparent',
                                borderBottom: '30px solid #ef5350', opacity: 0.7 // Muted Red (Softer)
                            }}></div>
                        ))}
                    </div>
                </>
            )}

            {/* CUTE WALKER (Chibi Style) */}
            <div
                className={`cute-walker walker-${mode}`}
                style={{
                    position: 'absolute',
                    bottom: mode === 'bridge' ? '70px' : '30px',
                    left: '-60px',
                    width: '40px',
                    height: '60px',
                    zIndex: 2,
                    animation: isPlaying
                        ? (mode === 'ground'
                            ? `walkGround ${animationDuration}s linear infinite`
                            : `walkBridge ${animationDuration}s linear infinite`)
                        : 'none',
                }}
            >
                {/* HEAD (Big & Round) */}
                <div style={{
                    position: 'absolute', top: '0', left: '0', width: '40px', height: '40px',
                    background: '#ffcc80', borderRadius: '50%',
                    boxShadow: 'inset -2px -2px 0 rgba(0,0,0,0.1)'
                }}>
                    {/* Eyes */}
                    <div style={{ position: 'absolute', top: '15px', left: '10px', width: '6px', height: '6px', background: '#333', borderRadius: '50%' }}></div>
                    <div style={{ position: 'absolute', top: '15px', right: '10px', width: '6px', height: '6px', background: '#333', borderRadius: '50%' }}></div>
                    {/* Smile */}
                    <div style={{
                        position: 'absolute', top: '22px', left: '14px', width: '12px', height: '6px',
                        borderBottom: '2px solid #e65100', borderRadius: '50%'
                    }}></div>
                    {/* Blush */}
                    <div style={{ position: 'absolute', top: '20px', left: '6px', width: '6px', height: '3px', background: '#ffab91', borderRadius: '50%', opacity: 0.6 }}></div>
                    <div style={{ position: 'absolute', top: '20px', right: '6px', width: '6px', height: '3px', background: '#ffab91', borderRadius: '50%', opacity: 0.6 }}></div>
                </div>

                {/* BODY (Small) */}
                <div style={{
                    position: 'absolute', top: '35px', left: '10px', width: '20px', height: '20px',
                    background: '#42a5f5', borderRadius: '10px', zIndex: -1
                }}></div>

                {/* LIMBS (Simple Noodles) */}
                {/* Left Leg */}
                <div style={{
                    position: 'absolute', top: '50px', left: '12px', width: '6px', height: '12px', background: '#333',
                    transformOrigin: 'top', borderRadius: '3px',
                    animation: isPlaying ? 'legBounce 0.4s infinite alternate' : 'none'
                }}></div>
                {/* Right Leg */}
                <div style={{
                    position: 'absolute', top: '50px', left: '22px', width: '6px', height: '12px', background: '#333',
                    transformOrigin: 'top', borderRadius: '3px',
                    animation: isPlaying ? 'legBounce 0.4s infinite alternate-reverse' : 'none'
                }}></div>

            </div>

            <style>{`
                @keyframes walkGround {
                    0% { left: -60px; opacity: 1; }
                    48% { left: 110%; opacity: 1; }
                    48.01% { opacity: 0; }
                    100% { opacity: 0; }
                }

                @keyframes walkBridge {
                    0% { opacity: 0; left: -60px; }
                    50% { opacity: 0; left: -60px; }
                    50.01% { opacity: 1; left: -60px; }
                    98% { left: 110%; opacity: 1; }
                    100% { left: 110%; opacity: 0; }
                }

                @keyframes legBounce {
                    from { transform: translateY(0); }
                    to { transform: translateY(-4px) rotate(10deg); } /* Bouncy walk */
                }
            `}</style>
        </div>
    );
};

export default SynthAnimation;
