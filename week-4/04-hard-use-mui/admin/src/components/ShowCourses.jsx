/* eslint-disable react/prop-types */
import { Button, Card, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ShowCourses() {
    const navigate = useNavigate()

    const [courses, setCourses] = React.useState([]);
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
        <h1>Create Course Page</h1>
        <Button variant="contained" style={{ marginLeft: 10 }} onClick={() => navigate('/createCourse')}>Add Course</Button>
        {courses.map(c => <Course key={c.id} id={c.id} title={c.title} description={c.description} image={c.imageLink} />)}
    </div>
}

function Course(props) {
    const navigate = useNavigate()
    return <Card variant="outlined" style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: 400,
        margin: '20px auto',
        padding: 30,
        borderRadius: 10
    }}>
        <Typography variant="h6" style={{ marginRight: 10 }}>Title : {props.title}</Typography>
        <Typography variant="div" style={{
            padding: 10,
            margin: '10px auto',
            border: '1px solid black',
            borderRadius: 10
        }}> description :{props.description}</Typography>
        <div><img style={{
            width:'300px'
        }} src={props.image} alt="image not found" srcset="" /></div>
        <br />
        <Button variant="contained" onClick={() => navigate(`/courses/${props.id}`)}>Edit</Button>
    </Card>
}

export default ShowCourses;