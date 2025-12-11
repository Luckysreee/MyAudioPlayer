import React from 'react';

const AccessibilityToggle = ({ isHighContrast, toggleHighContrast, label }) => {
    return (
        <button
            onClick={toggleHighContrast}
            aria-pressed={isHighContrast}
            className={isHighContrast ? 'active' : ''}
        >
            {label}
        </button>
    );
};

export default AccessibilityToggle;
