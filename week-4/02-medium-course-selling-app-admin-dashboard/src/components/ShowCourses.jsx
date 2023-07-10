import React, { useEffect, useState } from "react";

function ShowCourses() {
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
                    throw new Error('somethingw went wtong')
                }
                const data = await responseCourse.json()
                console.log(data)
            } catch (error) {
                console.log(error)
            }
        }
        fetchAllCourse()
    }, [fetchAll])
    return <div>
        <h1>Create Course Page</h1>
        {courses.length === 0 ? <div>No Course Avalable</div> : courses.map(c => <Course title={c.title} />)}
    </div>
}

function Course(props) {
    return <div>
        <h1>{props.title}</h1>
    </div>
}

export default ShowCourses;