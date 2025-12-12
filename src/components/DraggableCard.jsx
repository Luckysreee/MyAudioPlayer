import React, { useState, useRef, useEffect } from 'react';

const DraggableCard = ({ children, title, initialPos, initialSize, className = '' }) => {
    const [pos, setPos] = useState(initialPos || { x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [rel, setRel] = useState(null); // Relative position of cursor
    const cardRef = useRef(null);

    // Reset position if initialPos changes (e.g. Layout Reset)
    useEffect(() => {
        if (initialPos) setPos(initialPos);
    }, [initialPos]);

    const onMouseDown = (e) => {
        // Prevent drag if clicking on controls
        if (e.target.closest('.no-drag') || e.target.closest('input') || e.target.closest('button')) return;

        if (e.button !== 0) return; // Only left click
        setIsDragging(true);
        const rect = cardRef.current.getBoundingClientRect();

        // Calculate offset from top-left of card
        setRel({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });

        e.stopPropagation();
        e.preventDefault();
    };

    const onMouseMove = (e) => {
        if (!isDragging) return;

        // Calculate new position relative to parent (.app-content)
        // We need to account for the parent's offset? 
        // Actually, since position is fixed/absolute relative to closest positioned ancestor (.app-content)
        // We just need (Mouse - Rel - ParentOffset). 
        // Simpler: Just use page coordinates if parent is full screen? 
        // Better: Calculate relative to window, then subtracting parent offset might be needed if parent isn't at 0,0.
        // Assuming .app-content provides the context.

        // For simplicity in this "Free" mode, let's use fixed or absolute positioning.
        // If parent is relative, 'top/left' works.

        const parentRect = cardRef.current.parentElement.getBoundingClientRect();

        const newX = e.clientX - parentRect.left - rel.x;
        const newY = e.clientY - parentRect.top - rel.y;

        setPos({ x: newX, y: newY });
    };

    const onMouseUp = () => {
        setIsDragging(false);
    };

    // Styles
    const style = {
        position: 'absolute',
        left: pos.x + 'px',
        top: pos.y + 'px',
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
            <div className="card-handle-grip" style={{ position: 'absolute', top: '10px', right: '10px', opacity: 0.5, cursor: 'grab' }}>⋮⋮</div>
            <div className="card-content">
                {children}
            </div>
        </div>
    );
};

export default DraggableCard;
