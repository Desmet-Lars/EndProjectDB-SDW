'use client'
import React, {useEffect, useState} from 'react';
import Nav from '../nav';
import axios from 'axios';
import './ak.css';
import jwt from 'jsonwebtoken';
import {collection, getDocs, query, where} from "firebase/firestore";
import {db} from "../../lib/FirebaseConfig";
import {jwtConfig} from "../../lib/jwt";

function Page() {
    const [klas, setKlas] = useState({});
    const [students, setStudents] = useState([]);
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [studentReasons, setStudentReasons] = useState([]);
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
    const handleKlasChange = async (event) => {
        console.log('change')
        const selectedKlas = event.target.value;
        setKlas(selectedKlas);

        try {
            console.log('try', selectedKlas)
            const userSnapshot = await getDocs(query(collection(db, 'Students'), where('Class', '==', selectedKlas)));
            const usersData = userSnapshot.docs.map(doc => {
                const data = doc.data();
                console.log("data", data);
                return data; // Return data for each document
            });

            if (Array.isArray(usersData) && usersData.length > 0) {
                setStudents(usersData); // Set students state with the extracted data
                console.log(usersData)
                setSelectedStudents(Array(usersData.length).fill(false));
                setStudentReasons(Array(usersData.length).fill({ reason: '' }));
            }
        } catch (e) {
            console.log(e);
        }
    };


    const handleColorChange = (event) => {
        setSelectedColor(event.target.value);
    };

    const handleCheckboxChange = (index) => {
        const updatedStudents = [...selectedStudents];
        updatedStudents[index] = !updatedStudents[index];

        const updatedReasons = [...studentReasons];
        if (!updatedStudents[index]) {
            updatedReasons[index] = { reason: '' };
        }

        setSelectedStudents(updatedStudents);
        setStudentReasons(updatedReasons);
    };

    const handleReasonChange = (event, index) => {
        const newReason = event.target.value || 'gedraagt zich slecht';
        const updatedReasons = [...studentReasons];
        updatedReasons[index] = { reason: newReason };
        setStudentReasons(updatedReasons);
        console.log(updatedReasons);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const selectedStudentsData = students.filter((student, index) => selectedStudents[index]);
        const formData = selectedStudentsData.map((student, index) => ({
            color: selectedColor,
            reason: studentReasons[students.indexOf(student)]?.reason || 'gedraagt zich slecht',
            student: student.Name,
            teacher: username,
            klas: klas,
            time: new Date().toISOString()
        }));
        console.log("formdata", formData)

        try {
            const batch = db.batch();
            formData.forEach(data => {
                const docRef = db.collection('Codes').doc();
                batch.set(docRef, data);
                console.log("Added form: ", data)
            });
            const response = await axios.post('/api/addCode', formData);
            console.log('Data sent successfully');
            console.log(response);
            setSelectedColor('');
            setSelectedStudents(Array(students.length).fill(false));
            setStudentReasons(Array(students.length).fill({ reason: '' }));
            window.location.href = "/attitudekaarten";
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="ak">
            <Nav />
            <div className="attitude-card">
                <div className="container">
                    <form onSubmit={(e) => e.preventDefault()}>
                        <h1>
                            <label htmlFor="klas-select">Klas:</label>
                            <select
                                id="klas-select"
                                name="klas"
                                value={klas}
                                onChange={handleKlasChange}
                                className="select-styling"
                            >
                                <option value="">Selecteer Klas</option>
                                <option value="6TI-ICT">6TI-ICT</option>
                                <option value="5TI-ICT">5TI-ICT</option>
                                <option value="option3">Option 3</option>
                            </select>
                        </h1>
                    </form>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="colors">
                        <label htmlFor="colors">Code:</label>
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

                    <table className="student-table">
                        <thead>
                        <tr>
                            <th>Klas nr</th>
                            <th>Klas</th>
                            <th>Naam</th>
                            <th>Selecteer</th>
                            <th>Reden</th>
                        </tr>
                        </thead>
                        <tbody>
                        {students.map((student, index) => (
                            <tr key={index}>
                                <td>{student.id}</td>
                                <td>{student.Class}</td>
                                <td>{student.Name}</td>
                                <td>
                                    <input
                                        className="student-checkbox"
                                        type="checkbox"
                                        id={`studentCheckbox-${index}`}
                                        checked={selectedStudents[index] || false}
                                        onChange={() => handleCheckboxChange(index)}
                                    />
                                </td>
                                <td>
                                    {selectedStudents[index] && (
                                        <input
                                            className="student-reason"
                                            type="text"
                                            placeholder="Reden code"
                                            value={(studentReasons[index] && studentReasons[index].reason) || ''}
                                            onChange={(e) => handleReasonChange(e, index)}
                                            required
                                        />
                                    )}
                                </td>
                            </tr>
                        ))}

                        </tbody>
                    </table>

                    <button type="submit">Verstuur</button>
                </form>

                <div className="Options"></div>
            </div>
        </div>
    );
}

export default Page;
