import React, { useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import "../CSS/showCourse.css";
import { useNavigate } from "react-router-dom";

function ShowCourses() {

  const navigate = useNavigate();
  const [courses, setCourses] = React.useState([]);

  const handleUpdate = (id) =>{
    console.log(id)
    navigate(`/update/${id}`)
  }

  useEffect(() => {
    getCourses();
  }, []);

  const getCourses = async () => {
    try {
      const response = await fetch("http://localhost:3000/admin/courses");
      const data = await response.json();
      console.log(data.courses.title);
      setCourses(data.courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };
  // Add code to fetch courses from the server
  // and set it in the courses state variable.
  return (
    <div className="courses">
      <div className="coursesContainer">
        <h1 className="coursesHeading">UpComing Courses </h1>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>S.no</TableCell>
                <TableCell align="center">Course Name</TableCell>
                <TableCell align="center">Start Date<br></br>YYYY-MM-DD</TableCell>
                <TableCell align="center">Price</TableCell>

                <TableCell align="center">Edit</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {courses.map((course, index) => (
                <TableRow key={course.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell align="center">{course.title}</TableCell>
                  <TableCell align="center">{course.startDate}</TableCell>
                  <TableCell align="center">Rs.{course.price}</TableCell>

                  <TableCell align="center">
                    <button onClick={() => handleUpdate(course.id)} className="coursesButton">Uptdate</button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

      </div>
    </div>
  );
}

// function Course(props) {
//   return <div></div>;
// }

export default ShowCourses;
