import React, { useRef } from 'react';

const Playlist = ({ files, currentFileIndex, onPlay, onReorder, translations }) => {
    const dragItem = useRef(null);
    const dragOverItem = useRef(null);

    const handleSort = () => {
        let _files = [...files];
        const draggedItemContent = _files.splice(dragItem.current, 1)[0];
        _files.splice(dragOverItem.current, 0, draggedItemContent);
        dragItem.current = null;
        dragOverItem.current = null;
        onReorder(_files);
    };

    if (!files || files.length === 0) {
        return <div className="playlist-empty">{translations.noFileSelected || 'No files'}</div>;
    }

    return (
        <div className="playlist">
            <h3>{translations.playlist}</h3>
            {files.map((file, index) => (
                <div
                    key={`${file.name}-${index}`}
                    className={`playlist-item ${index === currentFileIndex ? 'active' : ''}`}
                    draggable
                    onDragStart={(e) => {
                        dragItem.current = index;
                        e.target.classList.add('dragging');
                    }}
                    onDragEnter={(e) => (dragOverItem.current = index)}
                    onDragEnd={(e) => {
                        e.target.classList.remove('dragging');
                        handleSort();
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    onClick={() => onPlay(index)}
                >
                    <span>{index + 1}. {file.name}</span>
                    <span>{/* Duration could go here if pre-calculated */}</span>
                </div>
            ))}
        </div>
    );
};

export default Playlist;
