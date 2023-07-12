import { Button, Card, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
/// You need to add input boxes to take input for users to create a course.
/// I've added one input so you understand the api to do it.
function CreateCourse() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");
    let token = null;

    function getToken() {
        token = localStorage.getItem('token')
    }
    getToken()

    const onAddCourse = async (e) => {
        e.preventDefault()
        if (title.length === 0 && description.length == 0) {
            setError('Title and description field should not be empty')
            return
        }
        try {
            const addCourseRes = await fetch(`http://localhost:3000/admin/courses`, {
                method: "POST",
                headers: {
                    "Content-Type": "Application/json",
                    'authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    title, description
                })
            }
            )
            const data = await addCourseRes.json()
            console.log(data)
        } catch (e) {
            console.log(e)
        }

    }
    return <div>
        <div style={{ paddingTop: 150, marginBottom: 10, display: 'flex', justifyContent: 'center' }}>
            <Typography variant="h6">Add Course</Typography>

        </div>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
            <form onSubmit={onAddCourse}>
                <Card variant="outlined" style={{ width: '400px', padding: '10px' }}>

                    <br />
                    <TextField id="outlined-basic" label="Title" onChange={(e) => (setError(''), setTitle(e.target.value))} variant="outlined" fullWidth={true} />
                    <br />
                    <br />
                    <TextField id="outlined-basic" label="description" onChange={(e) => (setError(''), setDescription(e.target.value))} variant="outlined" fullWidth={true} />
                    <br /><br />
                    <TextField id="outlined-basic" label="price" type="number" variant="outlined" fullWidth={true} />
                    <br /><br />
                    <Button type="submit" size="large" variant="contained">Add Course</Button>
                    <div style={{ color: 'red' }}>{error}</div>

                </Card>
            </form>
        </div>
    </div>
}
export default CreateCourse;