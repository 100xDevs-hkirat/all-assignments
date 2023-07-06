import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../CSS/course.css";

export default function Course() {

  const navigate = useNavigate();
  const { id } = useParams();

  const [course, setCourse] = useState([]);

  useEffect(() => {
    getCourse();
  }, []);

  const getCourse = async () => {
    const getData = await fetch(`http://localhost:3000/admin/course/${id}`);

    const data = await getData.json();
    setCourse(data.course);
    console.log(course)
  };

  const handlePurchase = () =>{

    addCourse();
    navigate('/mycourses');

   
  }

  const addCourse = async() => {

    const sendData = await fetch(`http://localhost:3000/users/courses/${id}`,{
      method : "POST",

      headers :{
        "Content-type" : "application/json",

                Authorization: `Bearer ${localStorage.getItem("userToken")}`,

      },

      body : JSON.stringify({
        title : course.title
      })
    })

    const response = await sendData.json();

    if(response.message === "Course purchased successfully"){
      alert('Course purchased successfully');
    }

    else{
      alert('There is some error')
    }

  }

  return (
    <div>
      <div className="course">
        <div className="courseTitle">{course.title}</div>

        <div className="courseDescription">
          React is a JavaScript-based UI development library. Facebook and an
          open-source developer community run it. Although React is a library
          rather than a language, it is widely used in web development. The
          library first appeared in May 2013 and is now one of the most commonly
          used frontend libraries for web development
        </div>
        <div className="courseButton">
          <button onClick={handlePurchase}>Purchase</button>
        </div>
      </div>
    </div>
  );
}
