import React from 'react';

const Home = ({ onNavigate, translations }) => {
    // Safety check just in case
    const t = translations || {};

    return (
        <div className="home-container" style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-color)',
            position: 'relative',
            overflow: 'hidden',
            // background: handled by .app-content
        }}>
            {/* Content */}
            <div style={{ zIndex: 1, textAlign: 'center', padding: '2rem' }}>
                <h1 style={{
                    fontSize: '4rem',
                    fontWeight: '800',
                    margin: '0 0 1rem 0',
                    color: 'var(--primary-color)',
                    textShadow: '0 0 40px rgba(187, 134, 252, 0.15)'
                }}>
                    {t.title || "Audio Studio"}
                </h1>
                <p style={{
                    fontSize: '1.5rem',
                    color: 'var(--text-muted)',
                    maxWidth: '600px',
                    margin: '0 auto 3rem auto',
                    lineHeight: '1.6'
                }}>
                    {t.subtitle}
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
                        title={t.player}
                        desc={t.playerDesc}
                        icon="🎵"
                        onClick={() => onNavigate('player')}
                    />
                    <FeatureCard
                        title={t.synthesizer}
                        desc={t.synthDesc}
                        icon="🎹"
                        onClick={() => onNavigate('synth')}
                    />
                    <FeatureCard
                        title={t.staveInput}
                        desc={t.staveDesc}
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
                        color: 'var(--bg-color)',
                        background: 'var(--primary-color)',
                        border: 'none',
                        borderRadius: '50px',
                        cursor: 'pointer',
                        boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
                        transition: 'transform 0.2s, box-shadow 0.2s, filter 0.2s'
                    }}
                    onMouseOver={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 12px 25px rgba(0,0,0,0.4)';
                        e.target.style.filter = 'brightness(1.1)';
                    }}
                    onMouseOut={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 8px 20px rgba(0,0,0,0.3)';
                        e.target.style.filter = 'brightness(1)';
                    }}
                >
                    {t.startCreating}
                </button>
            </div>


        </div>
    );
};

const FeatureCard = ({ title, desc, icon, onClick }) => (
    <div
        onClick={onClick}
        style={{
            background: 'var(--card-bg-glass)',
            backdropFilter: 'blur(10px)',
            border: '1px solid var(--card-border-glass)',
            padding: '2rem',
            borderRadius: '16px',
            width: '250px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            textAlign: 'left'
        }}
        onMouseOver={(e) => {
            e.currentTarget.style.background = 'var(--card-border-glass)';
            e.currentTarget.style.transform = 'translateY(-5px)';
        }}
        onMouseOut={(e) => {
            e.currentTarget.style.background = 'var(--card-bg-glass)';
            e.currentTarget.style.transform = 'translateY(0)';
        }}
    >
        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{icon}</div>
        <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-color)' }}>{title}</h3>
        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>{desc}</p>
    </div>
);

export default Home;
