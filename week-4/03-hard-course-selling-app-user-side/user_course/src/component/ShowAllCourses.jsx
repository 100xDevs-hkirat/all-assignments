/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
        <h1>Create Course Page</h1>
        {/* <button onClick={() => navigate('/createCourse')}>Add Course</button> */}
        {courses.map(c => <Course key={c.id} id={c.id} title={c.title} description={c.description} />)}
    </div>
}

function Course(props) {
    const navigate = useNavigate()
    return <div>
        <span style={{ marginRight: 10 }}>{props.title}</span><span>{props.description}</span><button onClick={() => navigate(`/course/${props.id}`)}>Add to the course</button>
    </div>
}

export default ShowAllCourses;