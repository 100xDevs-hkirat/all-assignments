import { Button, TextField, Card } from "@mui/material";
import { useState } from "react";
import { URL } from "./constants";

function AddCourse() {
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
              const options = {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                  title,
                  description,
                  price,
                  imageLink,
                  published: true,
                }),
              };
              fetch(`${URL}/admin/courses`, options)
                .then((res) => res.json())
                .then((data) => {
                  setMessage(data);
                });
            }}
          >
            Add Course
          </Button>
        </Card>
      </div>
    </div>
  );
}

export default AddCourse;
