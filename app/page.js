'use client';
import React, { useState } from 'react';
import "./login.css";
import { collection, getDocs, where, query } from 'firebase/firestore';
import { db } from '../lib/FirebaseConfig';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { jwtConfig } from '../lib/jwt';

const LoginPage = (props) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const q = await getDocs(query(collection(db, 'Users'), where('name', '==', username)));
      if (!q.empty) {
        const userData = q.docs[0].data();
        const passwordMatch = await bcrypt.compare(password, userData.password);
        if (passwordMatch) {
          function generateToken(name) {
            console.log('Generating token for:', name);

            const secretKey = jwtConfig.secret_Key;
            console.log('Using secret key:', secretKey);

            if (!name || typeof name !== 'string') {
              throw new Error('Invalid name provided');
            }

            if (!secretKey || typeof secretKey !== 'string') {
              throw new Error('Invalid secret key provided');
            }
            try {
              const token = jwt.sign({ id: name }, secretKey, { expiresIn: '1h' });
              console.log('Generated token:', token);
              return token;
            } catch (error) {
              console.error('JWT sign error:', error);
              throw error;
            }
          }
          const name = userData.name;
          const id = generateToken(name);
          sessionStorage.setItem('userId', id);
          window.location.href = "/dashboard";
        } else {
          setError('Invalid credentials. Please try again.');
        }
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch (error) {
      console.error('Login failed:', error);
      setError('Failed to login. Please try again.');
    }
  };

  return (
      <div className="login-page">
        <div className="login-container">
          <div className="orange-bar"></div>
          <div className="school-image">
            <img
                src="/img/images.png"
                alt="School Image"
            />
          </div>
          <form onSubmit={handleLogin}>
            <label>
              <span className="input-label">Username</span>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </label>
            <label>
              <span className="input-label">Password</span>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </label>
            <button type="submit">Login</button>
            {error && <p className="error-message">{error}</p>}
          </form>
        </div>
      </div>
  );
};

export default LoginPage;
