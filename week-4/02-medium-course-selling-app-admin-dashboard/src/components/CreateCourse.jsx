import React from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import axios from 'axios'
import { useSetRecoilState } from "recoil";
import { flashState } from "../store/atoms/flash";
/// You need to add input boxes to take input for users to create a course.
/// I've added one input so you understand the api to do it.
function CreateCourse() {
    const [title, setTitle] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [imageLink, setImageLink] = React.useState("");
    const [published, setPublished] = React.useState(false);
    const [price , setPrice] = React.useState(0);
    const navigate = useNavigate();
    const setSnackbar = useSetRecoilState(flashState);
    
    const createCourse = async() => {
        const token = localStorage.getItem('token')
        try {
            if(!(title && description && imageLink && price)){
                setSnackbar({
                    open: true,
                    message: "Please Fill the Required Fields",
                    severity: "error",
                })
                return
            }
            const response = await axios.post('http://localhost:3000/admin/courses',{
                title,
                description,
                imageLink,
                price,
                published
            }, {
              headers: {
                Authorization: `Bearer ${token}`,
                // Other headers if needed
              },
            });
            console.log(response)
            setSnackbar({
                open: true,
                message: "Course Created Successfully",
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
            <h1>Add A New Course</h1>
        </div>
        <div style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "1vh",
            }}>
            <Card variant="outlined" sx={{ minWidth: 250, width: 1/4}} style={{padding: "20px", backgroundColor:"#f7f9fa"}}>
                <TextField
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
                    variant="outlined"
                    label="Description"
                    required
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
                    variant="outlined"
                    label="Image Link"
                    type="text"
                    required
                    onChange={(e) => {
                        setImageLink(e.target.value)
                    }}
                    placeholder="Image Link"
                    sx={{width: 1}}
                />
                <br />
                <br />
                <TextField
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
                <Button onClick={createCourse} variant="contained">Create Course</Button>
            </Card>
        </div>
    </div>
    
}
export default CreateCourse;