import { Box, Card, Grid, Typography,FormControl,FormControlLabel,FormLabel,RadioGroup,Radio } from "@mui/material";
import React, { useState, useEffect } from "react";
import NaveBar from "./NavBar";
import Input from "./UI/InputField";
import Button from "./UI/FullWidthButton";
import { useParams } from "react-router-dom";
// / You need to add input boxes to take input for users to create a course.
// / I've added one input so you understand the api to do it.
function getCourse(courseId) {
    const [course, setCourse] = React.useState({});
    const token = localStorage.getItem("adminToken");
  
    useEffect(() => {
      fetch("http://localhost:3000/admin/courses", {
        headers: {
          Authorization: token,
        },
      })
        .then((res) => res.json())
        .then((data) => data.courses)
        .then((courses) => courses.find(course => course.id === courseId))
        .then(course => setCourse(course));
    }, []);
    return course;
}

function UpdateCourse() {
  const {courseId} = useParams();
  const course = getCourse(parseInt(courseId));
  const token = localStorage.getItem('adminToken');

  const [title, setTitle] = React.useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [imageLink, setImageLink] = useState("");
  const [published, setPublished] = useState(true);

  useEffect(()=>{
    setTitle(course.title);
    setPrice(course.price);
    setImageLink(course.imageLink);
    setDescription(course.description);
    setPublished(course.published);
  },[course]);

  const onChangeTitle = (event) => setTitle(event.target.value);

  const onChangePrice = (event) => {
    if (event.target.value < 0) {
      setPrice(0);
      retu;
    }
    setPrice(event.target.value);
  };

  const onChangeDescription = (event) => setDescription(event.target.value);

  const onChangeImageLink = (event) => setImageLink(event.target.value);

  const onChangePublished = event => setPublished(event.target.value);

  const onClick = () => {
    fetch(`http://localhost:3000/admin/courses/${parseInt(courseId)}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body:JSON.stringify({title, description, price, published, imageLink})
      })
     .then((res) => res.json())
     .then(data => data.message)
     .then(message => alert(message))
  }

  return (
    <Box>
      <NaveBar />
      <Container>
        <Card sx={{ width: "100%", maxWidth: 600, padding: 3, marginY: 1 }}>
            <FormControl sx={{display: 'grid', flexDirection:'row'}}>
              <FormLabel id = 'title'> Title: </FormLabel>
              <Input aria-labelledby='title' value={title} onChange={onChangeTitle} placeholder="Title"/>
            </FormControl>
            <FormControl sx={{display: 'grid', flexDirection:'row'}}>
              <FormLabel id = 'price'> Price: </FormLabel>
              <Input aria-labelledby='price' value={price} onChange={onChangePrice}/>
            </FormControl>
            <FormControl sx={{display: 'grid', flexDirection:'row'}}>
              <FormLabel id = 'imageLink'> Image Link: </FormLabel>
              <Input   variant="outlined"  InputProps={{ readOnly: true}} aria-labelledby='imageLink' value={imageLink} onChange={onChangeImageLink} placeholder="Image Link"/>
            </FormControl>
            <FormControl sx={{display: 'grid', flexDirection:'row'}}>
              <FormLabel id = 'description'>Description :</FormLabel>
              <Input aria-labelledby='description' value={description} onChange={onChangeDescription} placeholder="Description about course" multiline rows={5}/>
            </FormControl>
            <FormControl>
              <FormLabel id="published">Published</FormLabel>
              <RadioGroup
                row
                aria-labelledby="published"
                value={published}
                onChange={onChangePublished}
              >
                <FormControlLabel
                  value={true}
                  control={<Radio size="small"/>}
                  label="True"
                />
                <FormControlLabel
                  value={false}
                  control={<Radio size="small"/>}
                  label="False"
                />
              </RadioGroup>
           </FormControl>
           <Button onClick = {onClick}>Update Course</Button>
        </Card>
      </Container>
    </Box>
  );
}

function Container(props) {
  return (
    <Grid
      sx={{ margin: 3 }}
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
    >
      {props.children}
    </Grid>
  );
}
export default UpdateCourse;
