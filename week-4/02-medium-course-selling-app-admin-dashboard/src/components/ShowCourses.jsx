import React, { useEffect } from "react";
import NaveBar from "./NavBar";
import { Box } from "@mui/material";

function getCourses() {
  const [courses, setCourses] = React.useState([]);
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    fetch("http://localhost:3000/admin/courses", {
      headers: {
        Authorization: token,
      },
    })
      .then((res) => res.json())
      .then((data) => data.courses)
      .then((courses) => setCourses(courses));
  }, []);
  return courses;
}

function ShowCourses() {
  const courses = getCourses();
  console.log(courses);
  // Add code to fetch courses from the server
  // and set it in the courses state variable.
  return (
    <Box>
      <NaveBar />
      {courses.map((c) => (
        <Course id={c.id} title={c.title} />
      ))}
    </Box>
  );
}

function Course(props) {
  return (
    <div>
      <h1>{props.title}</h1>
    </div>
  );
}

export default ShowCourses;
