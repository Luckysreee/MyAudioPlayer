import React, { useRef } from 'react';

const Playlist = ({ files, currentFileIndex, onPlay, onReorder, onDelete, onClearAll, translations }) => {
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

    return (
        <div className="playlist" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>{translations.playlist}</h3>
                {files.length > 0 && (
                    <button onClick={onClearAll} style={{ fontSize: '0.8rem', padding: '0.3rem 0.6rem' }}>
                        {translations.clearAll}
                    </button>
                )}
            </div>

            {(!files || files.length === 0) && (
                <div className="playlist-empty">{translations.noFileSelected || 'No files'}</div>
            )}

            <div className="playlist-content custom-scroll" style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
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
                    >
                        <div onClick={() => onPlay(index)} style={{ flex: 1 }}>
                            <span>{index + 1}. {file.name}</span>
                        </div>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(index);
                            }}
                            style={{ marginLeft: '1rem', padding: '0.2rem 0.5rem', fontSize: '0.8rem', background: 'transparent', border: '1px solid #666' }}
                            aria-label="Delete"
                        >
                            ❌
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Playlist;
