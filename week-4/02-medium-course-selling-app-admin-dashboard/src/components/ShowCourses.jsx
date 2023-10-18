import React, { useEffect } from "react";
import Card from '@mui/material/Card';

function ShowCourses() {
    const [courses, setCourses] = React.useState([]);

    useEffect(() => {
        fetch('http://localhost:3000/admin/courses', {
            method: "GET",
            headers:{
                "Content-Type": "application/json"
            }
        }).then((res)=>{
            return res.json();
        }).then((data) => {
            console.log(data);
            setCourses(data.allCourses);
        })
    }, [])

    // Add code to fetch courses from the server
    // and set it in the courses state variable.
    return <div style={{display:"flex", alignItems:"center", flexDirection:"column", justifyContent:"center", height:"87vh"}}>
        <h1>All Courses </h1>
        <Card style={{overflow:"scroll", padding:"40px", width:"300px", height:"400px"}}>
            {courses.map(c => <Course title={c.title} description={c.description} published={c.published}/>)}
        </Card>
    </div>
}

function Course(props) {
    return <div>
        <Card>
        <h3>{props.title}</h3>
        <div>{props.description}</div>
        <div>{props.published}</div>
        </Card>
    </div>
}

export default ShowCourses;