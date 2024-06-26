'use client';
import React, { useState, useEffect } from 'react';
import './Codes.css'; // Make sure this path is correct
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../lib/FirebaseConfig";
import { jwtConfig } from "../../lib/jwt";
import jwt from "jsonwebtoken";

function Codes() {
    const [classData, setClassData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedClasses, setExpandedClasses] = useState({});
    const [expandedStudents, setExpandedStudents] = useState({});

    useEffect(() => {
        const token = sessionStorage.getItem('userId');

        if (!token) {
            window.location.href = "/";
        } else {
            try {
                const secretKey = jwtConfig.secret_Key;
                jwt.verify(token, secretKey);
            } catch (error) {
                console.error('Invalid token', error);
                window.location.href = "/codes";
            }
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const classResponse = await getDocs(collection(db, 'Klassen'));
                console.log(classResponse);
                const classIds = classResponse.docs.map(doc => doc.id);

                const data = await Promise.all(classIds.map(async (classId) => {
                    const studentResponse = await getDocs(query(collection(db, 'Students'), where('Class', '==', classId)));
                    const students = studentResponse.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));

                    const studentData = await Promise.all(students.map(async (student) => {
                        const codeResponse = await getDocs(query(collection(db, 'Codes'), where('student', '==', student.Name)));
                        const codes = codeResponse.docs.map(doc => ({
                            id: doc.id,
                            ...doc.data()
                        }));

                        codes.sort((a, b) => {
                            const dateA = new Date(a.time);
                            const dateB = new Date(b.time);
                            return dateB - dateA;
                        });

                        console.log("codes", codes);

                        return { ...student, codes };
                    }));

                    return { id: classId, students: studentData };
                }));

                setClassData(data);
            } catch (error) {
                setError('Error fetching data: ' + error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const toggleClassExpand = (classId) => {
        setExpandedClasses(prev => ({
            ...prev,
            [classId]: !prev[classId]
        }));
    };

    const toggleStudentExpand = (studentName) => {
        setExpandedStudents(prev => ({
            ...prev,
            [studentName]: !prev[studentName]
        }));
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <div className="recent-container">
                <h2>Alle codes</h2>
                <div className="class-items">
                    {classData.length > 0 ? (
                        classData.map((cls, classIndex) => (
                            <div
                                key={classIndex}
                                className={`class-item ${expandedClasses[cls.id] ? 'expanded' : ''}`}
                                onClick={() => toggleClassExpand(cls.id)}
                            >
                                <h3>{cls.id}</h3>
                                {expandedClasses[cls.id] && cls.students.length > 0 ? (
                                    cls.students.map((student, studentIndex) => (
                                        <div
                                            key={studentIndex}
                                            className={`student-item ${expandedStudents[student.Name] ? 'expanded' : ''}`}
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevent class toggle
                                                toggleStudentExpand(student.Name);
                                            }}
                                        >
                                            <h4>{student.Name}</h4>
                                            {expandedStudents[student.Name] && student.codes.length > 0 ? (
                                                <div className="code-grid">
                                                    {student.codes.map((code, codeIndex) => (
                                                        <div key={codeIndex} className="code-item" style={{ backgroundColor: code.color }}>
                                                            <div className="item-info">
                                                                <p><strong>Uur/datum:</strong> {new Date(code.time).toLocaleString()}</p>
                                                                {code.lastEdited && <p>(laatst aangepast: {new Date(code.lastEdited).toLocaleString()})</p>}
                                                                <hr />
                                                                <p><strong>Leerkracht: </strong>{code.teacher}</p>
                                                                <p><strong>Reden: </strong>{code.reason}</p>
                                                                <a className='edit' href={"/codes/edit/" + code.id}>Edit</a>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                expandedStudents[student.Name] && <p>Geen codes voor deze leerling</p>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    expandedClasses[cls.id] && <p>Geen leerlingen in deze klas</p>
                                )}
                            </div>
                        ))
                    ) : (
                        <p>Geen klassen</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Codes;
