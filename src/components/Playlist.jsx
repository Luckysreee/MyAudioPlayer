import React, { useRef } from 'react';

const Playlist = ({ files, currentFileIndex, onPlay, onReorder, onDelete, onClearAll, translations }) => {

    const moveUp = (index, e) => {
        e.stopPropagation();
        if (index === 0) return;
        const newFiles = [...files];
        [newFiles[index - 1], newFiles[index]] = [newFiles[index], newFiles[index - 1]];
        onReorder(newFiles);
    };

    const moveDown = (index, e) => {
        e.stopPropagation();
        if (index === files.length - 1) return;
        const newFiles = [...files];
        [newFiles[index + 1], newFiles[index]] = [newFiles[index], newFiles[index + 1]];
        onReorder(newFiles);
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
                    >
                        <div onClick={() => onPlay(index)} style={{ flex: 1, display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
                            <span style={{ marginRight: '8px', fontSize: '0.8rem', opacity: 0.7 }}>{index + 1}.</span>
                            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{file.name}</span>
                        </div>

                        <div className="flex-center gap-sm">
                            <button
                                onClick={(e) => moveUp(index, e)}
                                disabled={index === 0}
                                style={{
                                    padding: '2px',
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: index === 0 ? 'default' : 'pointer',
                                    opacity: index === 0 ? 0.3 : 1,
                                    color: index === currentFileIndex ? '#fff' : 'var(--text-color)'
                                }}
                                title="Move Up"
                            >
                                ▲
                            </button>
                            <button
                                onClick={(e) => moveDown(index, e)}
                                disabled={index === files.length - 1}
                                style={{
                                    padding: '2px',
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: index === files.length - 1 ? 'default' : 'pointer',
                                    opacity: index === files.length - 1 ? 0.3 : 1,
                                    color: index === currentFileIndex ? '#fff' : 'var(--text-color)'
                                }}
                                title="Move Down"
                            >
                                ▼
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(index);
                                }}
                                style={{
                                    marginLeft: '0.5rem',
                                    padding: '0.2rem 0.5rem',
                                    fontSize: '0.8rem',
                                    background: 'transparent',
                                    border: '1px solid currentColor',
                                    color: index === currentFileIndex ? '#fff' : 'var(--text-color)',
                                    borderColor: index === currentFileIndex ? '#fff' : '#666'
                                }}
                                aria-label="Delete"
                            >
                                ❌
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Playlist;
