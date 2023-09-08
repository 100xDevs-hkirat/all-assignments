import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"


const ParticularCourse = () => {
    const { id } = useParams()
    const token = localStorage.getItem('token')
    const [course, setCourse] = useState({})
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
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
            } catch (error) {
                console.log(error)
            }
        }
        fetchAllCourse()
    }, [token])
    useEffect(() => {
        setTitle(course.title)
        setDescription(course.description)
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
            imageLink: "",
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
        <div>
            <form onSubmit={editBtnHandler}>
                title-<input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                descritpion-<input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}

export default ParticularCourse