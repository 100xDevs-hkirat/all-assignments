import React, { useState,useEffect } from "react";
import { useParams } from "react-router-dom";

function ShowIndividualCourse(){
    const {courseId} = useParams();
    const [course, setCourse] = useState([]);
    useEffect(()=>{fetch("http://localhost:3000/admin/courses/"+courseId,{
        method:"GET",
        headers:{
            "Content-Type": "application/json",
            "authorization": localStorage.getItem('token')
        }
    }).then((resp)=>{
        resp.json().then((parsedResp)=>{
            console.log("parsed resp =",parsedResp);

            setCourse(parsedResp[0]);
        })
    })},[])
    return (
        <div>
          <h1>Course Details</h1>
          {course && (
            <Course
              title={course.title}
              description={course.description}
              price={course.price}
              imageLink={course.imageLink}
              published={course.published}
            />
          )}
        </div> );
}

function Course(props) {
    return <div>
        <p>
            <span>Title- {props.title} </span>
            <span>Description- {props.description} </span>
            <span>Price- {props.price} </span>
            <span>ImageLink- {props.imageLink} </span>
            <span>Published- {props.published}</span>
        </p>
    </div>

}
export default ShowIndividualCourse;