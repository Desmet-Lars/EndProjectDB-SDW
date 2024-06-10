'use client'
import React, { useState, useEffect } from 'react';
import "./nav.css";
import jwt from "jsonwebtoken";
import { jwtConfig } from '../lib/jwt'

function Nav() {
    const [username, setUsername] = useState('');

    useEffect(() => {
        // Function to verify and decode the JWT token to retrieve the user's name
        function decodeToken(token) {
            if (!token) {
                console.error('Token not provided');
                return null;
            }

            try {
                const secretKey = jwtConfig.secret_Key; // Get secret key from environment variable
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

    return (
        <header>
            <nav>
                <div className="pfp">
                    <h1>{username}</h1>
                </div>
                <ul className="nav-links">
                    <li>
                        <a href="/dashboard">Dash</a>
                    </li>
                    <li>
                        <a href="/attitudekaarten">AK</a>
                    </li>
                    <li>
                        <a href="/recent">Recent</a>
                    </li>
                    <li>
                        <a href="/logout" className="logout">
                            Uitloggen
                        </a>
                    </li>
                </ul>
            </nav>
        </header>
    );
}

export default Nav;
