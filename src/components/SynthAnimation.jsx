import React from 'react';

const SynthAnimation = ({ isPlaying, mode = 'ground', animationDuration = 4 }) => {
    // Mode: 'ground' (flat) or 'bridge' (raised with spikes)

    // Pixel Art Boy
    // A simple 12x12 or similar grid constructed via box-shadow or similar CSS is one way, 
    // but just simple blocks for body/head/legs is easier for a "walking" animation.

    return (
        <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', background: mode === 'bridge' ? '#1a1a1a' : '#222' }}>

            {/* Terrain Drawing */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '20px', background: '#388E3C' }}></div>

            {mode === 'bridge' && (
                <>
                    {/* Bridge structure */}
                    <div style={{ position: 'absolute', bottom: '20px', left: '0', width: '100%', height: '40px', background: '#555', zIndex: 1 }}></div>
                    {/* Spikes */}
                    <div className="spikes" style={{ position: 'absolute', bottom: '0', left: '0', width: '100%', height: '20px', display: 'flex', justifyContent: 'space-around' }}>
                        {[...Array(5)].map((_, i) => (
                            <div key={i} style={{ width: '0', height: '0', borderLeft: '10px solid transparent', borderRight: '10px solid transparent', borderBottom: '20px solid #D32F2F' }}></div>
                        ))}
                    </div>
                </>
            )}

            {/* Walking Person Container */}
            <div
                className="pixel-person"
                style={{
                    position: 'absolute',
                    bottom: mode === 'bridge' ? '60px' : '20px',
                    left: '-40px',
                    width: '30px',
                    height: '50px',
                    animation: isPlaying
                        ? `walkAcross ${animationDuration}s linear infinite`
                        : 'none',
                    animationDelay: mode === 'bridge' ? `${animationDuration / 2}s` : '0s'
                }}
            >
                {/* HEAD */}
                <div style={{
                    position: 'absolute', top: '0', left: '5px', width: '20px', height: '20px', background: '#FFCC80', borderRadius: '4px' // square-ish
                }}></div>
                {/* BODY */}
                <div style={{
                    position: 'absolute', top: '20px', left: '5px', width: '20px', height: '15px', background: '#1976D2'
                }}></div>
                {/* ARM */}
                <div style={{
                    position: 'absolute', top: '22px', left: '10px', width: '10px', height: '10px', background: '#FFCC80',
                    animation: 'armSwing 0.5s infinite alternate'
                }}></div>

                {/* LEGS */}
                <div className="leg left" style={{
                    position: 'absolute', top: '35px', left: '5px', width: '8px', height: '15px', background: '#333',
                    transformOrigin: 'top',
                    animation: isPlaying ? 'walkLeg 0.5s infinite alternate' : 'none'
                }}></div>
                <div className="leg right" style={{
                    position: 'absolute', top: '35px', left: '17px', width: '8px', height: '15px', background: '#333',
                    transformOrigin: 'top',
                    animation: isPlaying ? 'walkLeg 0.5s infinite alternate-reverse' : 'none'
                }}></div>
            </div>

            <style>{`
                @keyframes walkAcross {
                    0% { left: -40px; }
                    45% { left: 110%; } /* Standard speed across */
                    100% { left: 110%; }
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
