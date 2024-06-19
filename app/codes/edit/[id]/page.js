'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../../lib/FirebaseConfig';
import './EditCode.css';
import jwt from 'jsonwebtoken';
import { jwtConfig } from '../../../../lib/jwt';

const EditCode = () => {
    const { id } = useParams();
    const router = useRouter();
    const [codeData, setCodeData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        time: '',
        teacher: '',
        reason: '',
        color: '',
        lastEdited: ''
    });
    const [selectedColor, setSelectedColor] = useState('');

    useEffect(() => {
        const token = sessionStorage.getItem('userId');

        if (!token) {
            window.location.href = '/';
        } else {
            try {
                const secretKey = jwtConfig.secret_Key;
                jwt.verify(token, secretKey);
            } catch (error) {
                console.error('Invalid token', error);
                window.location.href = '/codes';
            }
        }
    }, []);

    useEffect(() => {
        if (id) {
            const fetchCodeData = async () => {
                try {
                    const codeDoc = await getDoc(doc(db, 'Codes', id));
                    if (codeDoc.exists()) {
                        const { time, teacher, reason, color, lastEdited } = codeDoc.data();
                        // Remove milliseconds and format as 'yyyy-MM-ddTHH:mm'
                        const formattedTime = new Date(time).toISOString().slice(0, 16);
                        setFormData({ time: formattedTime, teacher, reason, color, lastEdited });
                        setSelectedColor(color); // Set selectedColor based on retrieved data
                    } else {
                        setError('Code not found');
                    }
                } catch (error) {
                    setError('Error fetching code data: ' + error.message);
                } finally {
                    setLoading(false);
                }
            };

            fetchCodeData();
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleColorChange = (e) => {
        setSelectedColor(e.target.value);
        setFormData(prevState => ({
            ...prevState,
            color: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Convert formData.time to Firestore-compatible format
            const firestoreTime = new Date(formData.time).toISOString();
            const currentTime = new Date().toISOString();

            await updateDoc(doc(db, 'Codes', id), {
                ...formData,
                time: firestoreTime,
                lastEdited: currentTime
            });

            router.push('/codes'); // Redirect to the homepage or another page after successful update
        } catch (error) {
            setError('Error updating code: ' + error.message);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="edit-container">
            <h2>Edit Code</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Uur/Datum:</label>
                    <input disabled type="datetime-local" name="time" value={formData.time} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Leerkracht:</label>
                    <input type="text" name="teacher" value={formData.teacher} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Reden:</label>
                    <textarea name="reason" value={formData.reason} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Kleur:</label>
                    <select
                        name="color"
                        id="colors"
                        value={selectedColor}
                        onChange={handleColorChange}
                        className="select-styling"
                    >
                        <option value="" disabled hidden>Selecteer Code</option>
                        <option value="green" className="color-option-green">Groen</option>
                        <option value="yellow" className="color-option-yellow">Geel</option>
                        <option value="red" className="color-option-red">Rood</option>
                    </select>
                </div>
                <button type="submit">Verstuur</button>
            </form>
        </div>
    );
};

export default EditCode;
