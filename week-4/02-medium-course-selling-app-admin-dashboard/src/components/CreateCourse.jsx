import React from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
/// You need to add input boxes to take input for users to create a course.
/// I've added one input so you understand the api to do it.

function addCourse(courseTitle, navigate) {
    if (!courseTitle) return;
    axios.post('http://localhost:3000/admin/courses', {
        title: courseTitle
    }, {
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('userToken')
        }
    })
        .then(response => {
            console.log("Course Added");
            navigate('/courses');
        })
        .catch(error => {
            console.error('User registration error:', error);
        });

}

function CreateCourse() {
    const [title, setTitle] = React.useState("");
    const navigate = useNavigate();
    return <div>
        <h1>Create Course Page</h1>
        Course Title <input type={"text"} onChange={e => setTitle(e.target.value)} />
        <button onClick={() => addCourse(title, navigate)}>Create Course</button>
    </div>
}
export default CreateCourse;