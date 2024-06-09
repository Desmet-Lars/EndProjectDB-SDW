'use client'
import React, { useState, useEffect } from 'react';
import "./nav.css";

function Nav() {
    const [username, setUsername] = useState('');

    useEffect(() => {
        const storedUsername = sessionStorage.getItem('userId');
        setUsername(storedUsername);
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
