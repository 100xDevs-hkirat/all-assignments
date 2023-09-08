import { Button, Card, TextField, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"


const ParticularCourse = () => {
    const { id } = useParams()
    const token = localStorage.getItem('token')
    const [course, setCourse] = useState({})
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [imageLink, setImageLink] = useState('')
    const [courses, setCourses] = useState([])
    const navigate = useNavigate()
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
                const course_ = data.courses.filter(c => c.id === parseInt(id))
                setCourse(...course_)
                setCourses([...data.courses])
                setTitle(course.title)
                setDescription(course.description)
                setImageLink(course.imageLink)
            } catch (error) {
                console.log(error)
            }
        }
        fetchAllCourse()
    }, [token])
    useEffect(() => {
        setTitle(course.title)
        setDescription(course.description)
        setImageLink(course.imageLink)
    }, [course])
    console.log(course)
    // console.log(typeof(id))
    const editBtnHandler = async (e) => {
        e.preventDefault()
        if (title === "" || description === "") {
            return
        }
        const data = {
            title,
            description,
            imageLink: imageLink,
            publised: course.published
        }
        try {
            const responseCourse = await fetch(`http://localhost:3000/admin/courses/${id}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'Application/json',
                    'authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            })
            if (!responseCourse.ok) {

                console.log(responseCourse);
                alert(responseCourse.statusText);
                // throw new Error('something went wtong'),
                return
            }
            const res_data = await responseCourse.json()
            alert(res_data.message);
            navigate('/courses')
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <>
            <Typography variant="h4" style={{
                alignItems: 'center',
                textAlign: 'center'
            }}>Edit Course</Typography>
            <form onSubmit={editBtnHandler}>
                <Card variant='outlined' style={{
                    maxWidth: 400,
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    // justifyContent:'center',
                    alignItems: 'flex-start',
                    padding: 20,
                    margin: '10px auto',
                    borderRadius: 20

                }}>
                    <TextField label="title" variant="outlined" type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                    <br />
                    <br />

                    <TextField label="description" multiline
                        maxRows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
                    <br />

                    <TextField label="imageLink" variant="outlined" type="text" value={imageLink} onChange={(e) => setImageLink(e.target.value)} />

                    <Button variant="contained" type="submit">Submit</Button>
                </Card>
            </form>

        </>
    )
}

export default ParticularCourse