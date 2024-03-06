import React from "react";
import { useNavigate } from "react-router-dom";

function ShowCourses() {
    const [courses, setCourses] = React.useState([]);
    const navigateTo = useNavigate();
    const handleOnClick = () => {
        navigateTo('/about');
    };

    React.useEffect( () => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:3000/admin/courses", {
                    method: "GET",
                    headers: {
                        "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImhhcmtpcmF0MUBnbWFpbC5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MDk3MzY0NjQsImV4cCI6MTcwOTc0MDA2NH0.K7GRMddeAUydUStaAlFY25q4JHXqi5Tg7XBHEeZpnX8"
                    }
                });
                const data = await response.json();
                if(data) {
                    setCourses(data.courses);
                }
            } catch (error){
                console.error("Error fetching courses:", error);
            }
        };
        fetchData();
    }, []);

    return <div>
        <h1>All Courses</h1>
        {courses.map(c =>  <Course title = {c.title} description = {c.description}/> )} 
        <button onClick={handleOnClick}>Create new course</button>
    </div>
}

function Course(props) {
    return <div>
        <h2>{props.title}</h2>
        <p>{props.description}</p>
    </div>
}

export default ShowCourses;