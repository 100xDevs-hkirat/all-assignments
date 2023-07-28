import React, { useEffect, useState } from "react";
import CourseCard from "./CourseCard";
import Button from "@mui/material/Button";

import { Typography } from "@mui/material";
import "./style.css";
import { useNavigate } from "react-router-dom";

function ShowCourses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);

  // Add code to fetch courses from the server
  // and set it in the courses state variable.

  useEffect(() => {
    fetch("http://localhost:3000/admin/courses/", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setCourses(data.courses);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div
      style={{
        marginTop: "30px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Button
        style={{
          backgroundColor: "#101460",
          width: "130px",
          height: "70px",
          fontSize: "15px",
          borderRadius: "5px",
        }}
        className="button"
        variant="contained"
        onClick={() => navigate("/createCourse")}
      >
        Create new course
      </Button>
      <br />
      <div className="all-courses">
        {courses.map((course) => (
          <CourseCard key={course._id} course={course} />
        ))}
      </div>
    </div>
  );
}

export default ShowCourses;
