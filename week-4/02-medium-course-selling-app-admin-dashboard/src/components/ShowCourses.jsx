import React from "react";
import { useRecoilValue } from "recoil";
import { Link } from "react-router-dom";
import { localCourses } from "../recoil/atom";

function ShowCourses() {
    // const [courses, setCourses] = React.useState([]);
    const courses = useRecoilValue(localCourses)
    // Add code to fetch courses from the server
    // and set it in the courses state variable.
    return <div>
        <h1>Create Course Page</h1>
        <Link to={"/"} >Home</Link>
        {courses.map(c => <Course title={c.title} />)}
    </div>
}

function Course(props) {
    return <div>
        <h1>{props.title}</h1>
    </div>
}

export default ShowCourses;