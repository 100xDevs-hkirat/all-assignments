import React, { useEffect, useState } from "react";

import "../CSS/landing.css";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    getCourses();
  }, []);

  const getCourses = async () => {
    const getData = await fetch("http://localhost:3000/admin/courses", {
      // headers: {
      //   Authorization: `Bearer ${localStorage.getItem("Token")}`,
      // },
    });

    const data = await getData.json();
    setCourses(data.courses);
  };

  const handlePurchase = (id) => {
    if (localStorage.getItem("userToken")) {
      navigate(`/course/${id}`);
    } else {
      alert("Your are not Logged In");
      navigate("/login");
    }
  };
  return (
    <div className="landing">
      <div className="landingHeading">
        Welcome to Course.com<br></br>Learn new skills everyday.
      </div>

      {localStorage.getItem("userToken") ? 
        <div className="landingTable">
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead className="tableHeading">
                All Courses
                <TableRow>
                  <TableCell>S.no</TableCell>
                  <TableCell align="center">Course Name</TableCell>
                  <TableCell align="center">
                    Start Date<br></br>YYYY-MM-DD
                  </TableCell>
                  <TableCell align="center">Price</TableCell>

                  <TableCell align="center">Action</TableCell>
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
                      <button
                        onClick={() => handlePurchase(course.id)}
                        className="coursesButton"
                      >
                        Purchase
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
       : 
        <div> Please Login or Register</div>
      }
    </div>
  );
}
