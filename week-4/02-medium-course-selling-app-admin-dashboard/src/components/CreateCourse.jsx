import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import { useNavigate } from "react-router-dom";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
/// You need to add input boxes to take input for users to create a course.
/// I've added one input so you understand the api to do it.
function CreateCourse(props) {
  const navigate = useNavigate();
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [price, setPrice] = useState("");
  const [imageLink, setImageLink] = useState("");
  const [published, setPublished] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (props.isUpdate) {
      setTitle(props.course.title);
      setDescription(props.course.description);
      setPrice(props.course.price);
      setImageLink(props.course.imageLink);
      setPublished(props.course.published);
    }
  }, [props.course]);

  function createCourse() {
    // if (
    //   title.trim() === "" ||
    //   description.trim() === "" ||
    //   price.trim() === "" ||
    //   imageLink.trim() === "" ||
    //   published.trim() === ""
    // ) {
    //   setMessage("Text fields cannot be empty");
    //   return;
    // }
    fetch("http://localhost:3000/admin/courses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        title,
        description,
        price,
        imageLink,
        published,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        alert(data.message);
        setDescription("");
        setImageLink("");
        setTitle("");
        setPrice("");
        setPublished("");
        navigate("/courses");
      })
      .catch((err) => console.log(err));
  }

  function updateCourse() {
    fetch(`http://localhost:3000/admin/courses/${props.course._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        title,
        description,
        price,
        imageLink,
        published,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        alert(data.message);
        navigate("/courses");
      })
      .catch((err) => console.log(err));
  }

  return (
    <div className="page">
      <div className="title">
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
          }}
        >
          {props.isUpdate ? "Update Course" : "Create New Course"}
        </Typography>
        <br />
        {message && (
          <div>
            <p className="message">{message}</p>
            <br />
          </div>
        )}
      </div>
      <Card className="form">
        <TextField
          className="input"
          label="Title"
          variant="outlined"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          id="description"
          className="input"
          label="Description"
          variant="outlined"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <TextField
          className="input"
          label="Image URL"
          variant="outlined"
          type="text"
          value={imageLink}
          onChange={(e) => setImageLink(e.target.value)}
        />
        <FormControl>
          <InputLabel
            style={{ paddingRight: "5px" }}
            htmlFor="outlined-adornment-amount"
          >
            Amount
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-amount"
            startAdornment={<InputAdornment position="start">$</InputAdornment>}
            label="Amount"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </FormControl>
        <InputLabel id="demo-simple-select-label">Is Published</InputLabel>
        <Select
          style={{ padding: "0px" }}
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={published}
          label=""
          onChange={(e) => setPublished(e.target.value)}
        >
          <MenuItem value={false}>False</MenuItem>
          <MenuItem value={true}>True</MenuItem>
        </Select>
        {/* <input type="file" accept="image/*" /> */}

        <br />
        <Button
          style={{ backgroundColor: "#101460" }}
          className="button"
          variant="contained"
          onClick={() => (props.isUpdate ? updateCourse() : createCourse())}
        >
          {props.isUpdate ? "UPDATE" : "CREATE"}
        </Button>
      </Card>
    </div>
  );
}
export default CreateCourse;
