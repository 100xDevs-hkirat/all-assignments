import { Card } from "@mui/material";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { Button } from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "./AddCourse.css";

function AddCourse() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [price, setPrice] = useState("");
  const [publish, setPublish] = useState(false);

  const navigator = useNavigate();

  const addCourseHandler = e => {
    e.preventDefault();
    const course = {
      title,
      description,
      imageLink: imageUrl,
      price,
      published: publish,
    };

    const postCourse = async () => {
      console.log(localStorage.getItem("token"));
      try {
        const response = await axios.post(
          "http://127.0.0.1:3000/admin/courses",

          {
            ...course,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    };
    postCourse();

    console.log(course);
    navigator("/Courses");
    // setTitle("");
    // setDescription("");
    // setImageUrl("");
    // setPrice("");
    // setPublish(false);
  };

  return (
    <div className="addcourse-page">
      <Card variant="outlined" className="addcourse-form">
        <Typography className="addcourse-title" component="h1" variant="h5">
          Add Course
        </Typography>
        <div className="input">
          <TextField
            fullWidth={true}
            value={title}
            id="outlined-basic"
            label="Title*"
            variant="outlined"
            onChange={e => {
              console.log(e.target.value);
              setTitle(e.target.value);
            }}
          />
        </div>
        <div className="input">
          <TextField
            fullWidth={true}
            value={description}
            id="outlined-basic"
            label="Description*"
            variant="outlined"
            onChange={e => {
              setDescription(e.target.value);
            }}
          />
        </div>
        <div className="input">
          <TextField
            fullWidth={true}
            value={imageUrl}
            id="outlined-basic"
            label="ImageUrl*"
            variant="outlined"
            onChange={e => {
              setImageUrl(e.target.value);
            }}
          />
        </div>
        <div className="input">
          <TextField
            fullWidth={true}
            value={price}
            id="outlined-basic"
            label="Price*"
            variant="outlined"
            onChange={e => {
              setPrice(e.target.value);
            }}
          />
        </div>
        <FormControlLabel
          control={
            <Checkbox
              checked={publish}
              onChange={e => {
                setPublish(e.target.checked);
              }}
            />
          }
          label="Publish"
        />
        <div className="btn-container">
          <Button
            variant="contained"
            className="btn"
            fullWidth={true}
            onClick={addCourseHandler}
          >
            Add Course
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default AddCourse;
