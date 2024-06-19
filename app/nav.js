'use client'
import React, { useState, useEffect } from 'react';
import './nav.css';
import jwt from 'jsonwebtoken';
import { jwtConfig } from '../lib/jwt';
import { Logout } from './logout/api_logout'; // Corrected import path and component name
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons'; // Importing Font Awesome icons
import Link from 'next/link'; // Import Link from Next.js

function Nav() {
    const [username, setUsername] = useState('');
    const [isOpen, setIsOpen] = useState(false);

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
                <div onClick={toggleMenu} aria-label="Toggle navigation">
                    <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
                </div>
                <div className="profile">
                    <h1>{username}</h1>
                </div>
            </div>
            <nav className={`sidenav ${isOpen ? 'open' : 'closed'}`}>
                <ul className="nav-links">
                    <li><Link legacyBehavior href="/dashboard"><a>Dashboard</a></Link></li>
                    <li><Link legacyBehavior href="/attitudekaarten"><a>Attitude Kaarten</a></Link></li>
                    <li><Link legacyBehavior href="/recente"><a>Recente</a></Link></li>
                    <li><Link legacyBehavior href="/codes"><a>Alle codes</a></Link></li>
                </ul>
                <ul className="nav-links">
                    <Logout /> {/* Render the Logout component directly in the nav-links */}
                </ul>
            </nav>

            {isOpen && <div className="backdrop" onClick={toggleMenu}></div>}
        </header>
    );
}

export default Nav;
