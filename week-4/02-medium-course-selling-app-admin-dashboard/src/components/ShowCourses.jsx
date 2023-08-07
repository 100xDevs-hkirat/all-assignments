import React from "react";
import { useRecoilValue } from "recoil";
import { getToken } from "../recoil/atom";

function ShowCourses() {
    const [courses, setCourses] = React.useState([]);
    const token = useRecoilValue(getToken);
    // Add code to fetch courses from the server
    // and set it in the courses state variable.
    console.log(token)
    return <div>
        <h1>Create Course Page</h1>
        {courses.map(c => <Course title={c.title} />)}
    </div>
}

function Course(props) {
    return <div>
        <h1>{props.title}</h1>
    </div>
}

export default ShowCourses;