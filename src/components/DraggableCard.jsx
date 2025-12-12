import React, { useState, useRef, useEffect } from 'react';

const DraggableCard = ({ children, initialPos = { x: 0, y: 0 }, title, className = '' }) => {
    const [position, setPosition] = useState(initialPos);
    const cardRef = useRef(null);
    const dragStartPos = useRef(null); // { x, y } relative to viewport
    const cardStartPos = useRef(null); // { x, y } of card at start

    const handlePointerDown = (e) => {
        // Prevent dragging if interacting with inputs or sliders
        if (['INPUT', 'BUTTON', 'SELECT', 'TEXTAREA', 'LABEL'].includes(e.target.tagName)) return;

        e.currentTarget.setPointerCapture(e.pointerId);
        dragStartPos.current = { x: e.clientX, y: e.clientY };
        cardStartPos.current = { ...position };
        e.currentTarget.classList.add('dragging');
    };

    const handlePointerMove = (e) => {
        if (!dragStartPos.current) return;

        const dx = e.clientX - dragStartPos.current.x;
        const dy = e.clientY - dragStartPos.current.y;

        setPosition({
            x: cardStartPos.current.x + dx,
            y: cardStartPos.current.y + dy
        });
    };

    const handlePointerUp = (e) => {
        dragStartPos.current = null;
        cardStartPos.current = null;
        e.currentTarget.releasePointerCapture(e.pointerId);
        e.currentTarget.classList.remove('dragging');
    };

    return (
        <div
            ref={cardRef}
            className={`draggable-card ${className}`}
            style={{
                transform: `translate(${position.x}px, ${position.y}px)`,
                position: 'absolute', // Floating window
                touchAction: 'none', // Prevent scrolling on touch
                zIndex: dragStartPos.current ? 100 : 10 // Bring to front on drag
            }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
        >
            {/* Optional Header Handle */}
            <div className="card-handle" style={{ padding: '0.5rem', borderBottom: '1px solid var(--border-subtle)', cursor: 'grab', background: 'var(--bg-element)', borderRadius: 'var(--radius-md) var(--radius-md) 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600, fontSize: '0.9rem', pointerEvents: 'none' }}>{title || 'Window'}</span>
                <span style={{ fontSize: '0.8rem', opacity: 0.5 }}>⋮⋮</span>
            </div>
            <div className="card-content" style={{ padding: '1.5rem' }}>
                {children}
            </div>
        </div>
    );
};

export default DraggableCard;
