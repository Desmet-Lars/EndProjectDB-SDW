'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Recent.css'; // Make sure this path is correct
import {collection, getDocs, query, where} from "firebase/firestore";
import {db} from "../../lib/FirebaseConfig";
import {jwtConfig} from "../../lib/jwt";
import jwt from "jsonwebtoken";

function Recent() {
    const [recentData, setRecentData] = useState([]);
    const [sortCriteria, setSortCriteria] = useState('date');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [username, setUsername] = useState('');
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
                window.location.href="/recente"
            }
        }
    }, []);
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const storedToken = sessionStorage.getItem('userId');
                const decodedName = decodeToken(storedToken);

                const response = await getDocs(query(collection(db, 'Codes'), where('teacher', '==', decodedName)));
                const dataArray = response.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                console.log(dataArray);
                const sortedData = sortData(dataArray, sortCriteria);
                setRecentData(sortedData);
            } catch (error) {
                setError('Error fetching data: ' + error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [sortCriteria]);

    const sortData = (data, criteria) => {
        const sortedData = [...data];
        switch (criteria) {
            case 'color':
                const colorOrder = ['red', 'yellow', 'green'];
                return sortedData.sort((a, b) => colorOrder.indexOf(a.color) - colorOrder.indexOf(b.color));
            case 'date':
                return sortedData.sort((a, b) => new Date(b.time) - new Date(a.time));
            case 'hour':
                return sortedData.sort((a, b) => new Date(b.time).getHours() - new Date(a.time).getHours());
            default:
                return sortedData;
        }
    };

    const handleSortChange = (event) => {
        setSortCriteria(event.target.value);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <div className="recent-container">
                <h2>Recente Data</h2>
                <div className="sort-options">
                    <label htmlFor="sort">Sort by: </label>
                    <select id="sort" value={sortCriteria} onChange={handleSortChange}>
                        <option value="date">Datum</option>
                        <option value="color">Kleur</option>
                        <option value="hour">Uur</option>
                    </select>
                </div>
                <div className="recent-items">
                    {recentData.length > 0 ? (
                        recentData.map((item, index) => (
                            <div key={index} className="recent-item">
                                <div className="item-info">
                                    <p><strong style={{ backgroundColor: item.color }}>Code:</strong> {item.color}</p>
                                    <p><strong>Uur/datum:</strong> {new Date(item.time).toLocaleString()}</p>
                                    <hr/>
                                    <p><strong>Leerling: </strong>{item.student}</p>
                                    <p><strong>Reden: </strong>{item.reason}</p>
                                    <a className='edit' href={"/codes/edit/" + item.id}>Edit</a>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No recent data available</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Recent;
