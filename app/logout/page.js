// Logout.js
'use client'
import React, { useEffect } from 'react';

export function Logout() {
    function logout(){
        sessionStorage.clear();
        window.location.href = "/";
    }

    return (
            <li><a className="logout" onClick={logout}>Uitloggen</a></li>
    ); // Since this component is only used for side effects, it doesn't render anything
}
