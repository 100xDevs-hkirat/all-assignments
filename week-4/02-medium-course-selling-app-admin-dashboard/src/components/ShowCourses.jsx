import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import "./style.css";

function ShowCourses() {
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
    <div>
      <h1>Courses Page</h1>
      <div className="all-courses">
        {courses.map((course) => (
          <div key={course._id}>
            <Card sx={{ maxWidth: 345 }}>
              <CardMedia
                sx={{ height: 200, width: 350 }}
                image={course.imageLink}
                title={course.title}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {course.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {course.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small">Share</Button>
                <Button size="small">Learn More</Button>
              </CardActions>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ShowCourses;

// import React from "react";
// import { useEffect } from "react-router-dom";

// function ShowCourses() {
//   const [courses, setCourses] = React.useState([]);

// Add code to fetch courses from the server
// and set it in the courses state variable.

//   useEffect(() => {
//     fetch("http://localhost:3000/admin/courses/", {
//       headers: {
//         Authorization: "Bearer " + localStorage.getItem("token"),
//       },
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         setCourses(data);
//       })
//       .catch((err) => console.log(err));
//   }, []);

//   return (
//     <div>
//       <h1>Courses</h1>
//       {courses.map((course) => (
//         <div key={course._id}>{course.title}</div>
//       ))}
//     </div>
//   );
// }
// export default ShowCourses;
