import React from "react";
import { useNavigate } from "react-router-dom";
import { Typography, TextField, Button, Card } from "@mui/material";
/// You need to add input boxes to take input for users to create a course.
/// I've added one input so you understand the api to do it.
function CreateCourse() {
    const [title, setTitle] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [price, setPrice] = React.useState("");

    const navigate = useNavigate();

    return <div>
            <div style={{display:'flex', justifyContent:'center',marginTop: 50}}>
                <Typography variant="h5"><b>Add Course</b></Typography>
            </div>
        <div style={{display:'flex', justifyContent:'center'}}>
            <Card sx={{ minWidth: 275 }} style={{width: 400, padding: 20}}>
                <div>
                    <TextField fullWidth={true} variant="outlined" label="Title" type={"text"} onChange={e => setTitle(e.target.value)} />
                    <br /><br />
                    <TextField fullWidth={true} variant="outlined" label="Description" type={"text"} onChange={e => setDescription(e.target.value)} />
                    <br /> <br />
                    <TextField fullWidth={true} variant="outlined" label="Price" type={"number"} onChange={e => setPrice(e.target.value)} />
                    <br /> <br />
                    <TextField fullWidth={true} variant="outlined" label="Image Link" type={"url"} />
                    <br /> <br />
                    <TextField fullWidth={true} variant="outlined" label="Published" type={""} />
                    <br /> <br />
                    <div style={{display:'flex', justifyContent:'space-between'}}>
                        <Button variant="contained" onClick={() => {
                            fetch('http://localhost:3000/admin/courses', {
                                method: "POST",
                                body: JSON.stringify({
                                    title,
                                    description,
                                    price,
                                    imageLink: "",
                                    published: true
                                }),
                                headers: {
                                    "Content-type": "application/json",
                                    "Authorization": "Bearer " + localStorage.getItem("token")
                                }
                            }).then((res) => {
                                res.json().then((data) => {
                                    localStorage.setItem("token", data.token);
                                })
                            })
                        }}>
                            Upload
                        </Button>
                        <Button variant="outlined" onClick={() => {
                            navigate("/courses");
                        }}>
                            All Courses
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    </div>
}
export default CreateCourse;