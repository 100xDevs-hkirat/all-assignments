import { Card } from "@mui/material";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { Button } from "@mui/material";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import "./AddCourse.css";
import axios from "axios";

function UpdateCourse(props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [price, setPrice] = useState("");
  const [publish, setPublish] = useState(false);
  const { courseId } = useParams();
  const navigator = useNavigate();

  const updateCourseHandler = e => {
    e.preventDefault();

    const updateCourse = {};

    if (title) updateCourse.title = title;
    if (description) updateCourse.description = description;
    if (imageUrl) updateCourse.imageUrl = imageUrl;
    if (price) updateCourse.price = price;
    if (publish) updateCourse.published = publish;

    console.log(updateCourse);

    let UpdateRoute = async () => {
      try {
        let response = await axios.put(
          `http://127.0.0.1:3000/admin/courses/${courseId}`,
          { ...updateCourse },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );
        console.log(response);
        // props.onUpdateHandler(response.data);
        navigator("/Courses");
      } catch (error) {
        console.log(error);
      }
    };

    UpdateRoute();
    setTitle("");
    setDescription("");
    setImageUrl("");
    setPrice("");
    setPublish(false);
  };

  // useEffect({}, []);

  return (
    <div className="addcourse-page">
      <Card variant="outlined" className="addcourse-form">
        <Typography className="addcourse-title" component="h1" variant="h5">
          Update Course
        </Typography>
        <div className="input">
          <TextField
            fullWidth={true}
            value={title}
            id="outlined-basic"
            label="Title*"
            variant="outlined"
            onChange={e => {
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
              defaultChecked
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
            onClick={updateCourseHandler}
          >
            Update Course
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default UpdateCourse;
