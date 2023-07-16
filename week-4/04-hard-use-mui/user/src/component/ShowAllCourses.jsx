/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Button, Card } from '@mui/material'

function ShowAllCourses() {
    const navigate = useNavigate()

    const [courses, setCourses] = React.useState([]);
    const [fetchAll, setFetchAll] = useState(false)

    // Add code to fetch courses from the server
    // and set it in the courses state variable.
    const token = localStorage.getItem('token')
    useEffect(() => {
        const fetchAllCourse = async () => {
            try {
                const responseCourse = await fetch(`http://localhost:3000/users/courses`, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'Application/json',
                        'authorization': `Bearer ${token}`
                    }
                })
                if (!responseCourse.ok) {

                    console.log(responseCourse);
                    alert(responseCourse.statusText);
                    // throw new Error('something went wtong'),
                    return
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
        <Typography variant="h5">Create Course Page</Typography>
        {/* <button onClick={() => navigate('/createCourse')}>Add Course</button> */}
        <div style={{
            display:'flex',
            justifyContent:'center',
            flexWrap:'wrap'
        }}>
            {courses.map(c => <Course key={c.id} id={c.id} title={c.title} description={c.description} />)}
        </div>

    </div>
}

function Course(props) {
    const navigate = useNavigate()
    return <Card variant="outlined" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        // alinI
        padding: 20,
        width: 400,
        margin: '20px',
        borderRadius: 20
    }}>
        <div style={{ margin: 'auto' }}>{props.title}</div>
        <div style={{
            border: '1px solid black',
            padding: 10,
            margin: '10px 10px',
            borderRadius: 10
        }}>{props.description}</div>
        <Button variant="contained" onClick={() => navigate(`/course/${props.id}`)}>Add to the course</Button>
    </Card>
}

export default ShowAllCourses;