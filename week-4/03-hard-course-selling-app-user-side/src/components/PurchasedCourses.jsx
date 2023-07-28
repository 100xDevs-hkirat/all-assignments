import React, { useEffect, useState } from "react";
import CourseCard from "./CourseCard";
import "../index.css";
import { atom, useRecoilState } from "recoil";
import axios from "axios";
import { Main, openState } from "./AppNavBar";
import "./coursesStyles.css";
import Typography from "@mui/material/Typography";

function PurchasedCourses() {
  const [open, setOpen] = useRecoilState(openState);
  const [purCourses, setPurchasedCourses] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/users/purchasedCourses", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        setPurchasedCourses(res.data.purchasedCourses);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <Main open={open}>
      <Typography
        variant="h4"
        component="div"
        style={{
          flexGrow: 1,
          padding: "10px",
          borderRadius: "4px",
          fontWeight: "bold",
          color: "#101460",
          textAlign: "center",
          marginTop: "70px",
          marginLeft: "230px",
        }}
      >
        Purchased Courses
      </Typography>
      <div className="all-courses">
        {purCourses.map((course) => (
          <CourseCard key={course._id} course={course} isPurchased={true} />
        ))}
      </div>
    </Main>
  );
}

export default PurchasedCourses;
