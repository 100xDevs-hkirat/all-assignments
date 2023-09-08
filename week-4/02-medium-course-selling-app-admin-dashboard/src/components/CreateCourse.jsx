import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
/// You need to add input boxes to take input for users to create a course.
/// I've added one input so you understand the api to do it.
function CreateCourse() {
   const navigate= useNavigate()
    const [title, setTitle] = React.useState("");
    const [descritpion, setDescription] = React.useState("");
    const [price, setPrice] = React.useState("");
    const [error, setError] = useState('')
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
            imageLink: '',
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
    return <div>
        <h1>Create Course Page</h1>
        Title- <input type={"text"} onChange={e => setTitle(e.target.value)} />
        Description- <input type={"text"} onChange={e => setDescription(e.target.value)} />
        Price- <input type={"number"} onChange={e => setPrice(e.target.value)} />
        <button onClick={creatingCourse}>Create Course</button>
        <div style={{ color: 'red' }}>{error}</div>
        <button onClick={()=>navigate('/courses')}>See all Course </button>
    </div>
}
export default CreateCourse;