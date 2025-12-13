import React from 'react';

const Footer = ({ currentPageName }) => {
    return (
        <footer style={{
            flex: '0 0 auto',
            padding: '0.5rem 1rem',
            backgroundColor: 'var(--surface-color)',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            zIndex: 50,
            transition: 'background-color 0.3s, color 0.3s'
        }}>
            {/* Left: Metadata/Copyright */}
            <div>
                © 2025 Audio Studio
            </div>

            {/* Right: Page Name */}
            <div style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>
                {currentPageName || "Audio Studio"}
            </div>
        </footer>
    );
};

export default Footer;
