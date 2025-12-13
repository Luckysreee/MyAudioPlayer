import React, { useRef, useEffect } from 'react';

const StaveVisualizer = ({ melody, currentNoteIndex, isPlaying }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Resize logic (could be improved with ResizeObserver, but simple fit is fine for now)
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);

        const width = rect.width;
        const height = rect.height;

        // Drawing Config
        const staffGap = 20;
        const staffWidth = width * 0.8;
        const startX = (width - staffWidth) / 2;
        const middleY = height / 2;
        const staffTop = middleY - (staffGap * 2);

        // Clear
        ctx.clearRect(0, 0, width, height);

        // Draw Staff Lines
        ctx.strokeStyle = '#666'; // Muted color for lines
        ctx.lineWidth = 2; // Slightly thicker
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            const y = staffTop + (i * staffGap);
            ctx.moveTo(startX, y);
            ctx.lineTo(startX + staffWidth, y);
        }
        ctx.stroke();

        // Draw Treble Clef (Simplified or placeholder)
        // For now, let's just stick to the notes logic

        // Visualize Current Note
        if (isPlaying && currentNoteIndex >= 0 && melody.length > currentNoteIndex) {
            const currentNote = melody[currentNoteIndex];
            if (!currentNote) return;

            // Simplified note placement mapping
            // Middle C (C4) is usually one ledger line below the staff.
            // E4 is the bottom line.
            // F5 is the top line.
            // We need a mapping from Note+Octave to Y Position

            const noteNames = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
            // C4 index in diatonic scale? 
            // Let's create a "score" for the note relative to C4.
            // C4 = 0, D4 = 1, E4 = 2 ...

            const baseIndex = noteNames.indexOf(currentNote.note);
            const octaveOffset = (currentNote.octave - 4) * 7;
            const diatonicIndex = baseIndex + octaveOffset;

            // E4 is the first line (staffTop + 4*gap).
            // E4 index relative to C4: C, D, E -> 0, 1, 2.
            // So diatonicIndex = 2 corresponds to Y = staffTop + 4*gap.
            // Each step up is -0.5 * gap (lines and spaces).

            // E4 is correct:
            // Line 5 (bottom): E4
            // Line 4: G4
            // Line 3: B4
            // Line 2: D5
            // Line 1 (top): F5

            // Wait, standard Treble Clef:
            // Line 1 (Bottom): E4
            // Space 1: F4
            // Line 2: G4
            // ...

            // Let's re-align:
            // Bottom Line y = staffTop + 4 * gap.
            // This is E4.
            // Note Y = BottomLineY - (diatonicIndex - E4Index) * (gap / 2)

            const E4Index = 2; // C4=0, D4=1, E4=2.
            const bottomLineY = staffTop + (4 * staffGap);

            const noteY = bottomLineY - ((diatonicIndex - E4Index) * (staffGap / 2));

            // Draw Ledger Lines if needed
            // Ledger lines are needed if y >= bottomLineY + gap (below staff) 
            // or y <= staffTop - gap (above staff)
            // C4 (index 0) is below E4 (index 2). 2 steps below. 
            // C4 Y = BottomLineY - (0 - 2) * 10 = Bottom + 20.

            // Draw Note Head
            ctx.fillStyle = 'var(--primary-color)'; // Use theme color if possible, else a distinct one
            // We can't access CSS vars easily in canvas without computing styles. 
            // Let's pick a vibrant color or read computed style.
            const computedStyle = getComputedStyle(canvas);
            const primaryColor = computedStyle.getPropertyValue('--primary-color').trim() || '#2196F3';

            ctx.fillStyle = primaryColor;
            ctx.beginPath();
            ctx.ellipse(startX + staffWidth / 2, noteY, staffGap * 0.6, staffGap * 0.4, 0, 0, 2 * Math.PI);
            ctx.fill();

            // Draw Stem
            ctx.strokeStyle = primaryColor;
            ctx.lineWidth = 2;
            ctx.beginPath();
            // Stem usually goes up on right for notes below middle line, down on left for notes above.
            // Middle Line is B4 (diatonic index 6).
            if (diatonicIndex < 6) {
                // Up
                ctx.moveTo(startX + staffWidth / 2 + (staffGap * 0.6), noteY);
                ctx.lineTo(startX + staffWidth / 2 + (staffGap * 0.6), noteY - (staffGap * 3.5));
            } else {
                // Down
                ctx.moveTo(startX + staffWidth / 2 - (staffGap * 0.6), noteY);
                ctx.lineTo(startX + staffWidth / 2 - (staffGap * 0.6), noteY + (staffGap * 3.5));
            }
            ctx.stroke();

            // Draw Ledger Lines?
            // Simple logic for C4 (Middle C)
            if (currentNote.note === 'C' && currentNote.octave === 4) {
                ctx.beginPath();
                ctx.strokeStyle = '#666';
                ctx.moveTo(startX + staffWidth / 2 - staffGap, noteY);
                ctx.lineTo(startX + staffWidth / 2 + staffGap, noteY);
                ctx.stroke();
            }
            if (currentNote.note === 'A' && currentNote.octave === 5) {
                // A5 is just above the staff
                ctx.beginPath();
                ctx.strokeStyle = '#666';
                ctx.moveTo(startX + staffWidth / 2 - staffGap, noteY);
                ctx.lineTo(startX + staffWidth / 2 + staffGap, noteY);
                ctx.stroke();
            }
            // Logic can be generalized but this covers basic Middle C
        }

    }, [melody, currentNoteIndex, isPlaying]);

    return (
        <canvas
            ref={canvasRef}
            style={{ width: '100%', height: '100%', display: 'block' }}
        />
    );
};

export default StaveVisualizer;
