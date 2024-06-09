'use client'
import React from 'react';
import "./nav.css";

function nav() {
    const username = sessionStorage.getItem('userId')

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

export default nav;
