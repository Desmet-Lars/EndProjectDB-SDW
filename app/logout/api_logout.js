import React from 'react';
import { FaSignOutAlt } from 'react-icons/fa'; // Importing the SignOutAlt icon from react-icons/fa

export function Logout() {
    function logout() {
        sessionStorage.clear();
        window.location.href = "/";
    }

    return (
        <li className="logout">
            <a onClick={logout}>
                Uitloggen
                <FaSignOutAlt style={{ marginLeft: '5px' }} /> {/* Adding the SignOutAlt icon */}
            </a>
        </li>
    );
}
