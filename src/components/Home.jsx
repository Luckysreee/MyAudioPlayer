import React from 'react';

const Home = ({ onNavigate }) => {
    return (
        <div className="home-container" style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background Gradient Animation */}
            <div style={{
                position: 'absolute',
                top: '-50%',
                left: '-50%',
                width: '200%',
                height: '200%',
                background: 'radial-gradient(circle at center, #2e1065 0%, #000 70%)',
                animation: 'pulseBg 10s infinite alternate',
                zIndex: 0
            }}></div>

            {/* Content */}
            <div style={{ zIndex: 1, textAlign: 'center', padding: '2rem' }}>
                <h1 style={{
                    fontSize: '4rem',
                    fontWeight: '800',
                    margin: '0 0 1rem 0',
                    background: 'linear-gradient(to right, #a78bfa, #2dd4bf)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: '0 0 30px rgba(167, 139, 250, 0.3)'
                }}>
                    Audio Studio
                </h1>
                <p style={{
                    fontSize: '1.5rem',
                    color: '#94a3b8',
                    maxWidth: '600px',
                    margin: '0 auto 3rem auto',
                    lineHeight: '1.6'
                }}>
                    The professional playground for your sound. Visualize, Synthesize, and Compose in one seamless experience.
                </p>

                {/* Feature Grid */}
                <div style={{
                    display: 'flex',
                    gap: '2rem',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                    marginBottom: '4rem'
                }}>
                    <FeatureCard
                        title="Player"
                        desc="Advanced playback with real-time frequency visualization."
                        icon="🎵"
                        onClick={() => onNavigate('player')}
                    />
                    <FeatureCard
                        title="Synthesizer"
                        desc="Generate waveforms and noise with custom oscillators."
                        icon="🎹"
                        onClick={() => onNavigate('synth')}
                    />
                    <FeatureCard
                        title="Stave Input"
                        desc="Compose melodies using standard musical notation."
                        icon="🎼"
                        onClick={() => onNavigate('stave')}
                    />
                </div>

                <button
                    onClick={() => onNavigate('player')}
                    className="cta-button"
                    style={{
                        padding: '1rem 3rem',
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        color: '#fff',
                        background: 'linear-gradient(45deg, #7c3aed, #db2777)',
                        border: 'none',
                        borderRadius: '50px',
                        cursor: 'pointer',
                        boxShadow: '0 10px 25px rgba(124, 58, 237, 0.5)',
                        transition: 'transform 0.2s, box-shadow 0.2s'
                    }}
                    onMouseOver={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 15px 35px rgba(124, 58, 237, 0.6)';
                    }}
                    onMouseOut={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 10px 25px rgba(124, 58, 237, 0.5)';
                    }}
                >
                    Start Creating
                </button>
            </div>

            <style>{`
                @keyframes pulseBg {
                    0% { transform: scale(1); opacity: 0.8; }
                    100% { transform: scale(1.1); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

const FeatureCard = ({ title, desc, icon, onClick }) => (
    <div
        onClick={onClick}
        style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '2rem',
            borderRadius: '16px',
            width: '250px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            textAlign: 'left'
        }}
        onMouseOver={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.transform = 'translateY(-5px)';
        }}
        onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
            e.currentTarget.style.transform = 'translateY(0)';
        }}
    >
        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{icon}</div>
        <h3 style={{ margin: '0 0 0.5rem 0', color: '#fff' }}>{title}</h3>
        <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9rem' }}>{desc}</p>
    </div>
);

export default Home;
