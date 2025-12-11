import React from 'react';

const languages = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
    { code: 'fr', label: 'Français' },
    { code: 'sw', label: 'Kiswahili' }
];

const LanguageSelector = ({ currentLang, onLanguageChange }) => {
    return (
        <select
            value={currentLang}
            onChange={(e) => onLanguageChange(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: '4px', fontSize: '1rem', marginLeft: '1rem' }}
            aria-label="Select Language"
        >
            {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                    {lang.label}
                </option>
            ))}
        </select>
    );
};

export default LanguageSelector;
