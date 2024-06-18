'use client';
import React, {useEffect, useState} from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../lib/FirebaseConfig';
import bcrypt from 'bcryptjs';
import {jwtConfig} from "../../lib/jwt";
import jwt from "jsonwebtoken";

const CreateUserPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const token = sessionStorage.getItem('userId');

        if (!token) {
            window.location.href="/"
        } else {
            try {
                const secretKey = jwtConfig.secret_Key;
                jwt.verify(token, secretKey); // Replace 'your-secret-key' with your actual secret key
            } catch (error) {
                console.error('Invalid token', error);
                window.location.href="/CREATE"
            }
        }
    }, []);
    const handleCreateUser = async (e) => {
        e.preventDefault();

        try {
            // Hash the password before storing it
            const hashedPassword = await bcrypt.hash(password, 10);

            // Add the new user to the database
            await addDoc(collection(db, 'Users'), {
                name: username,
                password: hashedPassword,
            });

            setSuccess('User created successfully.');
            setError('');
        } catch (error) {
            console.error('Error creating user:', error);
            setError('Failed to create user. Please try again.');
            setSuccess('');
        }
    };

    return (
        <div className="create-user-page">
            <h2>Create User</h2>
            <form onSubmit={handleCreateUser}>
                <label>
                    Username:
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </label>
                <label>
                    Password:
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </label>
                <button type="submit">Create User</button>
            </form>
            {success && <p className="success-message">{success}</p>}
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default CreateUserPage;
