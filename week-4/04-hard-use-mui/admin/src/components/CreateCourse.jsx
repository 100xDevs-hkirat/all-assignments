import { Button, Card, TextField } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
/// You need to add input boxes to take input for users to create a course.
/// I've added one input so you understand the api to do it.
function CreateCourse() {
    const navigate = useNavigate()
    const [title, setTitle] = React.useState("");
    const [descritpion, setDescription] = React.useState("");
    const [price, setPrice] = React.useState("");
    const [error, setError] = useState('')
    const [imageLink,setImageLink]=useState('')
    const token = localStorage.getItem('token')
    const creatingCourse = async () => {
        setError('')
        if (title.length === 0 || descritpion.length === 0 || price.length === 0) {
            setError('All The Fields are mandatory')
            return
        }
        const courseData = {
            title: title,
            descritpion: descritpion,
            price: price,
            imageLink:imageLink,
            published: true
        }
        try {
            const responseCourse = await fetch(`http://localhost:3000/admin/courses`, {
                method: "POST",
                headers: {
                    'Content-Type': 'Application/json',
                    'authorization': `Bearer ${token}`
                },
                body: JSON.stringify(courseData)
            })
            if (!responseCourse.ok) {
                throw new Error('something went wtong')
            }
            const data = await responseCourse.json()
            alert(data.message)
            console.log(data)
            setDescription('')
            setPrice('')
            setTitle('')
        } catch (error) {
            console.log(error)
        }
    }
    return <div style={{
        display:'flex',
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center'
    }}>

        <h1>Create Course Page</h1>
        <Card variant="outlined" style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent:'flex-start',
            maxWidth:300,
            width:'100%',
            alignItems:'center',
            padding:10,
            borderRadius:10
        }}>
            <TextField label="title" type={"text"} onChange={e => setTitle(e.target.value)} /><br/>
            <TextField label="description" type={"text"} onChange={e => setDescription(e.target.value)} /><br/>
            <TextField label="image_link" type={"text"} onChange={e => setImageLink(e.target.value)} /><br/>
            <TextField label="price" type={"number"} onChange={e => setPrice(e.target.value)} /><br/>
            <Button variant="contained" onClick={creatingCourse}>Create Course</Button><br/><br/>
            <div style={{ color: 'red' }}>{error}</div><br/>
            <Button variant="contained" onClick={() => navigate('/courses')}>See all Course </Button>
        </Card>
    </div>
}
export default CreateCourse;