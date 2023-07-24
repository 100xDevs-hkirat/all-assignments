/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState, useRecoilValue } from "recoil";
import { Button, TextField, Card, Typography } from "@mui/material";

import { coursesState } from "./states";
import { URL } from "./constants";
import { useParams } from "react-router-dom";

export const CourseCard = ({ courseId }) => {
  const courses = useRecoilValue(coursesState);
  const course = courses.find((course) => course._id === courseId);
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Card style={{ margin: 10, width: 300, minHeight: 80 }}>
        <Typography textAlign={"center"} variant="h5">
          {course?.title}
        </Typography>
        <Typography textAlign={"center"}>{course?.description}</Typography>
        <img src={course?.imageLink} />
      </Card>
    </div>
  );
};

function UpdateCard({ courseId }) {
  const [courses, setCourses] = useRecoilState(coursesState);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageLink, setImageLink] = useState("");
  const [message, setMessage] = useState("");

  return (
    <div>
      {message && JSON.stringify(message)}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Card variant="outlined" style={{ width: 400, padding: 20 }}>
          <Typography>Update Course Details</Typography>
          <TextField
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            id="outlined-basic"
            label="Title"
            variant="outlined"
          />
          <br />
          <br />
          <TextField
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            id="outlined-basic"
            label="Description"
            variant="outlined"
          />
          <br />
          <br />
          <TextField
            onChange={(e) => setPrice(e.target.value)}
            fullWidth
            id="outlined-basic"
            label="Price"
            variant="outlined"
          />
          <br />
          <br />
          <TextField
            onChange={(e) => setImageLink(e.target.value)}
            fullWidth
            id="outlined-basic"
            label="Image Link"
            variant="outlined"
          />
          <br />
          <br />
          <Button
            size="large"
            variant="contained"
            onClick={() => {
              const editedCourse = {
                title,
                description,
                price,
                imageLink,
                published: true,
              };

              const options = {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(editedCourse),
              };
              fetch(`${URL}/admin/courses/${courseId}`, options)
                .then((res) => res.json())
                .then((data) => {
                  setMessage(data);

                  const updatedCourses = courses.map((prevCourse) => {
                    if (prevCourse._id === courseId) {
                      return { ...prevCourse, ...editedCourse };
                    }

                    return prevCourse;
                  });

                  setCourses(updatedCourses);
                });
            }}
          >
            Update Course
          </Button>
        </Card>
      </div>
    </div>
  );
}

const Course = () => {
  let { courseId } = useParams();
  const setCourses = useSetRecoilState(coursesState);

  useEffect(() => {
    const options = {
      method: "GET",
      headers: {
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };
    fetch(`${URL}/admin/courses`, options)
      .then((res) => res.json())
      .then((data) => {
        setCourses(data?.courses);
      });
  }, []);

  return (
    <div
      style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}
    >
      <CourseCard courseId={courseId} />
      <UpdateCard courseId={courseId} />
    </div>
  );
};

export default Course;
