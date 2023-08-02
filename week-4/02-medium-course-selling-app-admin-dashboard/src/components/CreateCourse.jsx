import React from "react";
import { Card,Typography,Button,TextField } from "@mui/material";
import axios from 'axios'

function CreateCourse() {
    const [title, setTitle] = React.useState("");
    const [description, setDescription] = React.useState('')
    const [price, setPrice] = React.useState(0)
    const[imageLink,SetImageLink]=React.useState('')
    const[published,setPublished]=React.useState(false);

    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: 15,
          paddingTop: 50,
        }}
      >
        <Card varint={'outlined'} style={{ width: 400, padding: 20 }}>
          <Typography variant="h6" style={{ textAlign: 'center' }}>
            Add Course
          </Typography>
          <br />
          <TextField
            id="title"
            label="Title"
            variant="outlined"
            fullWidth={true}
            style={{ marginBottom: 10 }}
            onChange={(e) => {
              setTitle(e.target.value)
            }}
          />

          <TextField
            id="description"
            label="Description"
            variant="outlined"
            fullWidth={true}
            style={{ marginBottom: 10 }}
            onChange={(e) => {
              setDescription(e.target.value)
            }}
          />
          <TextField
            id="price"
            label="Price"
            variant="outlined"
            type="number"
            fullWidth={true}
            style={{ marginBottom: 10 }}
            onChange={(e) => {
              setPrice(e.target.value)
            }}
          />
          <TextField
            id="image"
            label="Image Link"
            variant="outlined"
            fullWidth={true}
            style={{ marginBottom: 10 }}
            onChange={(e) => {
              SetImageLink(e.target.value)
            }}
          />
          <TextField
            id="published"
            label="Published"
            variant="outlined"
            fullWidth={true}
            style={{ marginBottom: 10 }}
            onChange={(e) => {
              setPublished(e.target.value)
            }}
          />
          <br />
          <br />
          <Button
            variant="contained"
            fullWidth={true}
            onClick={async () => {
              const res = await axios.post(
                'http://localhost:3000/admin/courses',
                {
                  title: title,
                  description: description,
                  price: price,
                  imageLink: imageLink,
                  published: published,
                },
                {
                  headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token'),
                  },
                }
              )
              alert('Course created successfully')
              window.location='/courses'

              // fetch('http://localhost:3000/admin/courses', {
              //   method: 'POST',
              //   body: JSON.stringify({
              //     title: title,
              //     description: description,
              //     price: price,
              //     imageLink: imageLink,
              //     published: published,
              //   }),
              //   headers: {
              //     'Content-type': 'application/json',
              //     Authorization: 'Bearer ' + localStorage.getItem('token'),
              //   },
              // }).then((res) => {
              //   res.json().then((data) => {
              //     alert("Course created successfully")
              //     window.location='/courses'
              //   })
              // })
            }}
          >
            Add Course
          </Button>
        </Card>
      </div>
    )
}
export default CreateCourse;