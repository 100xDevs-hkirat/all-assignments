import React from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
function getCourses(setCourses) {
    axios.get('http://localhost:3000/users/courses', {
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

function purchaseCourse(courseId){
    if (!courseId){
        console.log("Course Id null");
        return;
    }
    axios.post('http://localhost:3000/users/courses/' + courseId,{} , {
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('userToken')
        }
    })
        .then(response => {
            console.log("Course Purchased")
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
        <a href="/purchased">List of Purchased Courses </a>
        <br/>
        <button onClick={() => logUserOut(navigate)}> LogOut </button>
        <br/>
        {courses.map(c => <Course title={c.title} courseId={c.id} setCourses={setCourses} />)}
    </div>
}

function Course(props) {
    return <div>
        <h1>{props.title}</h1>
        <button onClick={() => purchaseCourse(props.courseId)}> Purchase Course</button>
    </div>
}

export default ShowCourses;