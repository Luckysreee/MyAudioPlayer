import React from 'react';

export const Icon = ({ name, size = 20, color = 'currentColor', className = '' }) => {
    const icons = {
        play: (
            <path d="M5 3l14 9-14 9V3z" />
        ),
        pause: (
            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
        ),
        stop: (
            <path d="M6 6h12v12H6z" />
        ),
        next: (
            <path d="M5 4l10 8-10 8V4zm10 0v16h4V4h-4z" />
        ),
        prev: (
            <path d="M19 20L9 12l10-8v16zM5 4h4v16H5V4z" />
        ),
        upload: (
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
        ),
        trash: (
            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        ),
        settings: (
            <path d="M12.22 2h-.44a2 2 0 0 1-2-2 2 2 0 0 0-2 2l-.1.4a2 2 0 0 1-2.07 1.5 2 2 0 0 1-1.6-1.3l-.2-.8a2 2 0 0 0-2.4 0l-.8.6a2 2 0 0 1-1.3 1.6 2 2 0 0 1-2-2.07l.4-.1a2 2 0 0 0 0-2.4l-.6-.8a2 2 0 0 1-1.6-1.3 2 2 0 0 1 2.07-2l.1-.4a2 2 0 0 0-2.4 0l-.8.6a2 2 0 0 1-1.3 1.6 2 2 0 0 1-2-2.07l.4-.1a2 2 0 0 0 0-2.4l-.6-.8a2 2 0 0 1-1.6-1.3 2 2 0 0 1 2.07-2l.1-.4a2 2 0 0 0-2 0 2 2 0 0 1 2.4l.6.8a2 2 0 0 1 1.6 1.3 2 2 0 0 1-2 2.07l-.4.1a2 2 0 0 0 0 2.4l.6.8a2 2 0 0 1 1.6 1.3 2 2 0 0 1-2-2.07l-.1.4a2 2 0 0 0 2.4 0l.8-.6a2 2 0 0 1 1.3-1.6 2 2 0 0 1 2 2.07l-.4.1a2 2 0 0 0 0 2.4l.6.8a2 2 0 0 1 1.6 1.3 2 2 0 0 1 2-2.07l.1-.4a2 2 0 0 0 2 0zm-2 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
        ),
        sun: (
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z" />
        ),
        moon: (
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        ),
        eye: (
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 5a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
        ),
        reset: (
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" />
        ),
        grid: (
            <path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" />
        )
    };

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            {icons[name] || null}
        </svg>
    );
};
