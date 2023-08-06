import React from "react";
import axios from "axios"

function ShowCourses() {
    const [courses, setCourses] = React.useState([]);

    React.useEffect(()=>{
        const token = {
            Authorization: "Bearer "+JSON.parse(localStorage.getItem("auth"))
        }
        axios.get("http://localhost:3000/admin/courses/",{
            headers: token
        }).then((res)=>{
            setCourses(res.data.courses)
            console.log(res.data.courses);
        })
    },[])
    // Add code to fetch courses from the server
    // and set it in the courses state variable.
    return <div>
        <h1>Create Course Page</h1>
        {courses.map(c => <Course title={c} />)}
    </div>
}

function Course(props) {
    const {title,description,price,published} = props.title
    return <div>
        <h1>title - {title}</h1>
        <p>description - {description}</p>
        <p>price - {price}</p>
        <p>published - {published}</p>
    </div>
}

export default ShowCourses;