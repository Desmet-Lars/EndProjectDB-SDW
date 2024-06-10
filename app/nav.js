import React, { useState, useEffect } from 'react';
import './nav.css';
import jwt from 'jsonwebtoken';
import { jwtConfig } from '../lib/jwt';
import { Logout } from './logout/api_logout'; // Make sure to import the Logout component

function Nav() {
    const [username, setUsername] = useState('');
    const [isMobile, setIsMobile] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const handleResize = () => {
                setIsMobile(window.innerWidth <= 768);
            };

            // Initial check
            setIsMobile(window.innerWidth <= 768);

            // Attach the event listener
            window.addEventListener('resize', handleResize);

            // Clean up the event listener
            return () => {
                window.removeEventListener('resize', handleResize);
            };
        }
    }, []);

    useEffect(() => {
        function decodeToken(token) {
            if (!token) {
                console.error('Token not provided');
                return null;
            }

            try {
                const secretKey = jwtConfig.secret_Key;
                const decoded = jwt.verify(token, secretKey);
                return decoded.id;
            } catch (error) {
                console.error('Error decoding token:', error.message);
                return null;
            }
        }

        const storedToken = sessionStorage.getItem('userId');
        if (!storedToken) {
            console.error('No token found in sessionStorage');
            setUsername(null);
        } else {
            const decodedName = decodeToken(storedToken);
            setUsername(decodedName);
            console.log('Decoded username:', decodedName);
        }
    }, []);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <header className="navbar">
            <div className="container">
                <div className="profile" onClick={toggleMenu}>
                    <h1>{username}</h1>
                </div>
                <div className="nav-toggle" onClick={toggleMenu} aria-label="Toggle navigation">
                    <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'}`}></i>
                </div>
            </div>
            <nav className={`sidenav ${isOpen ? 'open' : ''}`}>
                <ul className="nav-links">
                    <li><a href="/dashboard">Dashboard</a></li>
                    <li><a href="/attitudekaarten">Attitude Kaarten</a></li>
                    <li><a href="/recente">Recente</a></li>
                    <Logout />
                </ul>
            </nav>

            {isOpen && <div className="backdrop" onClick={toggleMenu}></div>}
        </header>
    );
}

export default Nav;
