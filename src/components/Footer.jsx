import React from 'react';

const Footer = () => {
    return (
        <footer style={{
            background: '#0f172a',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            padding: '2rem 4rem',
            color: '#94a3b8',
            fontSize: '0.9rem',
            marginTop: 'auto'
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '2rem'
            }}>
                {/* Brand */}
                <div>
                    <h3 style={{ color: '#fff', marginBottom: '1rem' }}>Audio Studio</h3>
                    <p>Professional audio tools for the modern web. Built with React and Web Audio API.</p>
                </div>

                {/* Links */}
                <div>
                    <h4 style={{ color: '#fff', marginBottom: '1rem' }}>Product</h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        <li style={{ marginBottom: '0.5rem' }}><a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Features</a></li>
                        <li style={{ marginBottom: '0.5rem' }}><a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Pricing</a></li>
                        <li style={{ marginBottom: '0.5rem' }}><a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Download</a></li>
                    </ul>
                </div>

                {/* Company */}
                <div>
                    <h4 style={{ color: '#fff', marginBottom: '1rem' }}>Company</h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        <li style={{ marginBottom: '0.5rem' }}><a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>About Us</a></li>
                        <li style={{ marginBottom: '0.5rem' }}><a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Careers</a></li>
                        <li style={{ marginBottom: '0.5rem' }}><a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Contact</a></li>
                    </ul>
                </div>

                {/* Social */}
                <div>
                    <h4 style={{ color: '#fff', marginBottom: '1rem' }}>Connect</h4>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <span>Twitter</span>
                        <span>GitHub</span>
                        <span>Discord</span>
                    </div>
                </div>
            </div>

            <div style={{
                textAlign: 'center',
                marginTop: '3rem',
                paddingTop: '1rem',
                borderTop: '1px solid rgba(255,255,255,0.05)'
            }}>
                © 2025 Audio Studio. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
