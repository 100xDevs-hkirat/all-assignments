import React from "react";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Course from "./Course";
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import { useSetRecoilState } from "recoil";
import { flashState } from "../store/atoms/flash";
/// You need to add input boxes to take input for users to create a course.
/// I've added one input so you understand the api to do it.
function UpdateCourse() {

    const { courseId } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [imageLink, setImageLink] = React.useState("");
    const [published, setPublished] = React.useState(true);
    const [price ,setPrice] = React.useState(0);
    const setSnackbar = useSetRecoilState(flashState);
    

    React.useEffect(() =>{
        const token = localStorage.getItem('token')
        const fetchData = async () => {
            try {
              const response = await axios.get('http://localhost:3000/admin/course/' + courseId, {
                headers: {
                  Authorization: `Bearer ${token}`,
                  // Other headers if needed
                },
              });
              console.log(response)
              let course = response.data.course
              setTitle(course.title)
              setDescription(course.description)
              setImageLink(course.imageLink)
              setPrice(course.price)
              setPublished(course.published)
            } catch (error) {
              console.error('Error fetching data:', error);
              
            }
          };
      
          fetchData();
    }, [])
    
    const updateCourse = async () => {
        const token = localStorage.getItem('token')
        try {
            const response = await axios.put('http://localhost:3000/admin/courses/' + courseId,{
                title,
                description,
                imageLink,
                price
            }, {
              headers: {
                Authorization: `Bearer ${token}`,
                // Other headers if needed
              },
            });
            console.log(response)
            setSnackbar({
                open: true,
                message: "Course Updated Successfully",
                severity: "success",
            })
            navigate('/courses')
          } catch (error) {
            setSnackbar({
                open: true,
                message: "Something Went Wrong",
                severity: "error",
            })
            console.error('Error fetching data:', error);
          }
    }

    return <div>
        <div style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "10vh",
                color: "white"
            }}>
            <h1>Update the Course</h1>
        </div>
        <div style={{
                display: "flex",
                flexWrap: 'wrap',
                justifyContent: "center",
                marginTop: "1vh"
            }}>
            <Card variant="outlined" sx={{ minWidth: 300, width: 1/4}} style={{padding: "20px", backgroundColor:"#f7f9fa", margin: "25px 10px"}}>
                <TextField
                    value={title}
                    variant="outlined"
                    required
                    label="Title"
                    onChange={(e) => {
                        setTitle(e.target.value)
                    }}
                    type="text"
                    placeholder="Enter Title"
                    sx={{width: 1}}
                />
                <br />
                <br />
                <TextField
                    value={description}
                    variant="outlined"
                    label="Description"
                    type="text"
                    onChange={(e) => {
                        setDescription(e.target.value)
                    }}
                    placeholder="Enter Description"
                    multiline
                    sx={{width: 1}}
                />
                <br />
                <br />
                <TextField
                    value={imageLink}
                    variant="outlined"
                    label="Image Link"
                    type="text"
                    onChange={(e) => {
                        setImageLink(e.target.value)
                    }}
                    placeholder="Image Link"
                    sx={{width: 1}}
                />
                <br />
                <br />
                <TextField
                value={price}
                    variant="outlined"
                    required
                    label="Price"
                    onChange={(e) => {
                        setPrice(e.target.value)
                    }}
                    type="text"
                    placeholder="Enter Price"
                    sx={{width: 1}}
                />
                <br />
                <br />
                <Button onClick={updateCourse} variant="contained">Update Course</Button>
            </Card>
            <Course title={title} description={description} link={imageLink} published={published} price={price}/>
        </div>
    </div>
    
}
export default UpdateCourse;