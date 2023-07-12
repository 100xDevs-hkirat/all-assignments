import React, { useEffect } from "react";
import axios from 'axios';

function ShowCourses() {
    const [courses, setCourses] = React.useState([]);

    // Add code to fetch courses from the server
    // and set it in the courses state variable.
    useEffect(() => {
        axios({
            method: 'GET',
            url: 'http://localhost:3000/admin/courses',
            headers: {
                'Content-Type': 'multipart/form-data',
                "Authorization": `Bearer ${localStorage.getItem('token')}`,
            }
        }).then((response) =>{
            console.log(response.data.courses)
            setCourses(response.data.courses);
        }).catch(function (error) {
            console.log(error.response.data);
            alert(error.response.data.message);
        });
    }, [])
    return <div>
        <h1>Create Course Page</h1>
        {courses.map(c => <Course key={c.id} title={c.title} description={c.description} price={c.price} imageLink={c.imageLink} published={c.published}/>)}
    </div>
}

function Course(props) {
    return <div>
        <h1>{props.title}</h1>
        <h2>{props.description}</h2>
        <h2>{props.price}</h2>
        <h2>{props.imageLink}</h2>
        <h2>{props.published}</h2>

    </div>
}

export default ShowCourses;