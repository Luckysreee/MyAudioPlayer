import React, { useState, useRef, useEffect } from 'react';

const DraggableCard = ({ children, title, initialPos, initialSize, className = '', hideHeader = false, scale = 1 }) => {
    const [pos, setPos] = useState(initialPos || { x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [rel, setRel] = useState(null); // Relative position of cursor
    const cardRef = useRef(null);

    // Removed auto-reset of pos on initialPos change to prevent snapping back

    const onMouseDown = (e) => {
        // Prevent drag if clicking on controls
        if (e.target.closest('.no-drag') || e.target.closest('input') || e.target.closest('button')) return;

        if (e.button !== 0) return; // Only left click
        setIsDragging(true);
        const rect = cardRef.current.getBoundingClientRect();

        // Calculate offset from top-left of card (Screen Pixels)
        setRel({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });

        e.stopPropagation();
        e.preventDefault();
    };

    const onMouseMove = (e) => {
        if (!isDragging) return;

        const parentRect = cardRef.current.parentElement.getBoundingClientRect();

        // Calculate position in Scaling Context
        const newX = (e.clientX - parentRect.left - rel.x) / scale;
        const newY = (e.clientY - parentRect.top - rel.y) / scale;

        setPos({ x: newX, y: newY });
    };

    const onMouseUp = () => {
        setIsDragging(false);
    };

    // Styles
    const formatVal = (v) => typeof v === 'number' ? `${v}px` : v;
    const style = {
        position: 'absolute',
        left: formatVal(pos.x),
        top: formatVal(pos.y),
        width: initialSize ? initialSize.width : 'auto',
        height: initialSize ? initialSize.height : 'auto',
        zIndex: isDragging ? 1000 : 10,
    };

    return (
        <div
            ref={cardRef}
            className={`draggable-card ${isDragging ? 'dragging' : ''} ${className}`}
            style={style}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
        >
            {title && <div className="card-header">{title}</div>}
            {!hideHeader && <div className="card-handle-grip" style={{ position: 'absolute', top: '10px', right: '10px', opacity: 0.5, cursor: 'grab' }}>⋮⋮</div>}
            <div className="card-content">
                {children}
            </div>
        </div>
    );
};

export default DraggableCard;
