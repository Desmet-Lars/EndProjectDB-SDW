'use client'
import React, { useState } from 'react';
import Nav from '../nav';
import axios from 'axios';
import './ak.css';

function Page() {
    const [klas, setKlas] = useState('');
    const [students, setStudents] = useState([]);
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [studentReasons, setStudentReasons] = useState([]);

    const handleKlasChange = async (event) => {
        console.log('change')
        const selectedKlas = event.target.value;
        setKlas(selectedKlas);

        try {
            console.log('try', selectedKlas)
            const response = await fetch('/api/attitudekaarten_klas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ klas: selectedKlas })
            });

            if (response.ok) {
                const data = await response.json();
                if (Array.isArray(data)) {
                    setStudents(data);
                    setSelectedStudents(Array(data.length).fill(false));
                    setStudentReasons(Array(data.length).fill({ reason: '' }));
                } else {
                    console.error('Expected array but received:', data);
                    setStudents([]);
                    setSelectedStudents([]);
                    setStudentReasons([]);
                }
            } else {
                console.error('Failed to fetch students');
                setStudents([]);
                setSelectedStudents([]);
                setStudentReasons([]);
            }
        } catch (error) {
            console.error('Error:', error);
            setStudents([]);
            setSelectedStudents([]);
            setStudentReasons([]);
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
            student: student.name,
            teacher: sessionStorage.getItem("userId"),
            klas: klas,
            time: new Date().toISOString()
        }));

        try {
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
                            <tr key={student.id}>
                                <td>{student.nr}</td>
                                <td>{student.klas}</td>
                                <td>{student.name}</td>
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
