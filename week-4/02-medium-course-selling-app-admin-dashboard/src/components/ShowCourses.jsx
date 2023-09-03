import React from "react";
import axios from 'axios';
import propTypes from 'prop-types';

function ShowCourses() {
    const [courses, setCourses] = React.useState([]);

    // Add code to fetch courses from the server
    // and set it in the courses state variable.
    React.useEffect(() => {
        axios("http://localhost:3000/admin/courses", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${localStorage.getItem("token")}`
            }
        }).then(res => res.data)
        .then(data => {
            setCourses(data.courses);
        }).catch(err => console.error(err));
    }, [setCourses]);

    return <div>
        <h1>Courses</h1>
        {courses.map(c => <Course key={c.id} {...c} />)}
    </div>
}

function Course(props) {
    return <div key={props.id}>
        <h3>{props.title}</h3>
        <h4>Price: {props.price}</h4>
        <h4>published: {props.published?"yes":"no"}</h4>
        <p>{props.description}</p>
        <img src={props.imageLink} alt={props.title} />

    </div>
}

Course.propTypes = {
    id: propTypes.number,
    title: propTypes.string,
    price: propTypes.number,
    published: propTypes.bool,
    description: propTypes.string,
    imageLink: propTypes.string
}
export default ShowCourses;