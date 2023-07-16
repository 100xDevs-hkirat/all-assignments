import React from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
function getCourses(setCourses) {
    axios.get('http://localhost:3000/admin/courses', {
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('userToken')
        }
    })
        .then(response => {
            setCourses(response.data.courses);
        })
        .catch(error => {
            console.error('Course Fetch error:', error);
        });
}

function logUserOut(navigate){
    localStorage.removeItem('userToken');
    navigate('/')
}

function ShowCourses() {
    const [courses, setCourses] = React.useState([]);
    const navigate = useNavigate();
    React.useEffect(() => {
        getCourses(setCourses);
        const timeout = setInterval(() => {
            getCourses(setCourses);
        }, 1000);
        return () => clearInterval(timeout);
    }, [])
    return <div>
        <h1>Courses</h1>
        <a href="/about">Create new Course</a>
        <button onClick={() => logUserOut(navigate)}>LogOut</button>
        <br/>
        {courses.map(c => <Course title={c.title} setCourses={setCourses} />)}
    </div>
}

function Course(props) {
    return <div>
        <h1>{props.title}</h1>
    </div>
}

export default ShowCourses;