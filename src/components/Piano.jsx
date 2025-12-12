import React, { useState } from 'react';

const Piano = ({ onKeyClick, octave = 4 }) => {
    const [activeKey, setActiveKey] = useState(null);

    const keys = [
        { note: 'C', type: 'white', label: `C${octave}` },
        { note: 'C#', type: 'black', label: `C#${octave}` },
        { note: 'D', type: 'white', label: `D${octave}` },
        { note: 'D#', type: 'black', label: `D#${octave}` },
        { note: 'E', type: 'white', label: `E${octave}` },
        { note: 'F', type: 'white', label: `F${octave}` },
        { note: 'F#', type: 'black', label: `F#${octave}` },
        { note: 'G', type: 'white', label: `G${octave}` },
        { note: 'G#', type: 'black', label: `G#${octave}` },
        { note: 'A', type: 'white', label: `A${octave}` },
        { note: 'A#', type: 'black', label: `A#${octave}` },
        { note: 'B', type: 'white', label: `B${octave}` }
    ];

    const handleKeyPress = (key) => {
        setActiveKey(key.note);
        onKeyClick(key.note);
        setTimeout(() => setActiveKey(null), 200);
    };

    const whiteKeyStyle = (isActive) => ({
        position: 'relative',
        width: '50px',
        height: '200px',
        background: isActive
            ? 'linear-gradient(to bottom, #d0d0d0 0%, #e8e8e8 100%)'
            : 'linear-gradient(to bottom, #ffffff 0%, #f0f0f0 100%)',
        border: '2px solid #222',
        borderRadius: '0 0 8px 8px',
        boxShadow: isActive
            ? 'inset 0 5px 10px rgba(0,0,0,0.3), 0 2px 5px rgba(0,0,0,0.2)'
            : '0 4px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.8)',
        cursor: 'pointer',
        transition: 'all 0.1s ease',
        transform: isActive ? 'translateY(2px)' : 'translateY(0)',
        userSelect: 'none',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        paddingBottom: '10px',
        fontSize: '0.75rem',
        fontWeight: '600',
        color: '#333'
    });

    const blackKeyStyle = (isActive) => ({
        position: 'absolute',
        width: '32px',
        height: '130px',
        background: isActive
            ? 'linear-gradient(to bottom, #1a1a1a 0%, #2a2a2a 100%)'
            : 'linear-gradient(to bottom, #000000 0%, #1a1a1a 100%)',
        border: '1px solid #000',
        borderRadius: '0 0 4px 4px',
        boxShadow: isActive
            ? 'inset 0 3px 8px rgba(0,0,0,0.5), 0 2px 4px rgba(0,0,0,0.4)'
            : '0 4px 8px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)',
        cursor: 'pointer',
        transition: 'all 0.1s ease',
        transform: isActive ? 'translateY(2px)' : 'translateY(0)',
        zIndex: 2,
        userSelect: 'none',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        paddingBottom: '8px',
        fontSize: '0.65rem',
        fontWeight: '600',
        color: '#ccc'
    });

    const getBlackKeyPosition = (note) => {
        const positions = {
            'C#': '34px',
            'D#': '84px',
            'F#': '184px',
            'G#': '234px',
            'A#': '284px'
        };
        return positions[note];
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            padding: '20px',
            background: 'linear-gradient(to bottom, #2d2d2d 0%, #1a1a1a 100%)',
            borderRadius: '12px',
            boxShadow: '0 8px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
            position: 'relative',
            width: 'fit-content',
            margin: '0 auto'
        }}>
            <div style={{ position: 'relative', display: 'flex' }}>
                {/* White keys */}
                {keys.filter(k => k.type === 'white').map((key) => (
                    <div
                        key={key.note}
                        className="no-drag"
                        onMouseDown={() => handleKeyPress(key)}
                        style={whiteKeyStyle(activeKey === key.note)}
                    >
                        {key.label}
                    </div>
                ))}

                {/* Black keys - positioned absolutely */}
                {keys.filter(k => k.type === 'black').map((key) => (
                    <div
                        key={key.note}
                        className="no-drag"
                        onMouseDown={() => handleKeyPress(key)}
                        style={{
                            ...blackKeyStyle(activeKey === key.note),
                            left: getBlackKeyPosition(key.note)
                        }}
                    >
                        {key.label}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Piano;
