import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

export default function MyCourses() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    getCourses();
  }, []);

  const getCourses = async () => {
    try {
      const getData = await fetch(
        "http://localhost:3000/users/purchasedCourses",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );

      const data = await getData.json();
      setCourses(data.purchasedCourses);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  return (
    <div className="landing">
      <div className="landingHeading">My Courses</div>

      <div className="landingTable">
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead className="tableHeading">
              <TableRow>
                <TableCell>S.no</TableCell>
                <TableCell align="center">Course Name</TableCell>
                <TableCell align="center">
                  Start Date<br />
                  YYYY-MM-DD
                </TableCell>
                <TableCell align="center">Price</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {courses && courses.length > 0 ? 
                courses.map((course, index) => (
                <TableRow key={course.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell align="center">{course.title}</TableCell>
                  <TableCell align="center">{course.startDate}</TableCell>
                  <TableCell align="center">Rs.{course.price}</TableCell>
                 
                </TableRow>
              )): <div> There are no purchased courses</div>}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}
