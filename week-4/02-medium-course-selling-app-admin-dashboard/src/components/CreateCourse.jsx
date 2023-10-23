import React from "react";

import '../CSS/createCourse.css'
import { Navigate, useNavigate } from "react-router-dom";
/// You need to add input boxes to take input for users to create a course.
/// I've added one input so you understand the api to do it.
function CreateCourse() {

    const navigate = useNavigate();
    const [title, setTitle] = React.useState("");
    const [startDate, setStartDate] = React.useState("");
    const [price, setPrice] = React.useState("");



    const handleCreate = async() =>{
        const sendData = await fetch('http://localhost:3000/admin/courses',
        {
            method : "POST",

            headers:{
                "Content-Type": "application/json",
            },

            body: JSON.stringify({
                title : title,
                startDate : startDate,
                price : price,
               
              }),
        });

        const response = await sendData.json();

        alert('Course Created')
        navigate('/courses')
    }

    return <div className="createCourse">
        <div className="createCourseContainer">
        <h1 className="createCourseHeading">Create Course Page</h1>
       <div className = "inputContainer"> <label className="createCourseLable">Title</label>
        <input type={"text"} onChange={e => setTitle(e.target.value)} /></div>

       <div className = "inputContainer"> 
       <label className="createCourseLable">Start Date</label>
        <input
        type="date"
        id="date"
        onChange={e => setStartDate(e.target.value)}
      />

<div className = "inputContainer"> <label className="createCourseLable">Price in Rupees</label>
        <input type={"number"} onChange={e => setPrice(e.target.value)} /></div>


      </div>
        <button className = "createCourseButton" onClick={handleCreate}>Create Course</button>
    </div>
    </div>
}
export default CreateCourse;