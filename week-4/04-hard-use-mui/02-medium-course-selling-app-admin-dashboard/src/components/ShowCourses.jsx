/* eslint-disable react/prop-types */
import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ShowCourses() {
    const navigate = useNavigate()
    const [courses, setCourses] = useState([]);
    const [fetchAll, setFetchAll] = useState(false)
    // Add code to fetch courses from the server
    // and set it in the courses state variable.
    const token = localStorage.getItem('token')
    useEffect(() => {
        const fetchAllCourse = async () => {
            try {
                const responseCourse = await fetch(`http://localhost:3000/admin/courses`, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'Application/json',
                        'authorization': `Bearer ${token}`
                    }
                })
                if (!responseCourse.ok) {
                    throw new Error('something went wtong')
                }
                const data = await responseCourse.json()
                console.log(data.courses)
                setCourses([...data.courses])
            } catch (error) {
                console.log(error)
            }
        }
        fetchAllCourse()
    }, [fetchAll, token])
    return <div>
        <Button variant="contained" onClick={() => navigate('/addCourse')}>Create Course Page</Button>
        {courses.length === 0 ? <div>No Course Avalable</div> : <ul>{courses.map(c => <Course key={c.id} title={c.title} description={c.description} />)}</ul>}
    </div>
}

function Course(props) {
    return <li>
        <span>{props.title}</span><span style={{ marginLeft: 10 }}>{props.description}</span>
    </li>
}

export default ShowCourses;