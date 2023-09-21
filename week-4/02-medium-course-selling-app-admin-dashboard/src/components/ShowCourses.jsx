import React, { useEffect, useState } from "react";
import axios from 'axios';
import { json, useNavigate } from "react-router-dom";
import { Button, Card, Typography, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { BASE_URL } from "../config";

function ShowCourses() {
    const [courses, setCourses] = useState([]);

    const populateCourses = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/admin/courses`, {
                headers: {
                    "Authorization": localStorage.getItem("token")
                }
            });
            if (response.data.courses) {
                setCourses(response.data.courses);
            }
        } catch (err) {
        }
    }

    useEffect(() => {
        populateCourses();
    }, []);


    if (!courses) {
        return <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
            <Typography variant="h3">
                Loding....
            </Typography>
        </div>
    } else {
        return <div>
            <div>
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <Typography variant='h3' style={{ marginTop: 30 }}>
                        Courses
                    </Typography>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", marginTop: 10 }}>
                    {courses.map((course) => {
                        return <div>
                            <Course key={course.id} course={course} setCourses={setCourses} />
                        </div>
                    })}
                </div>
            </div>
        </div>
    }
}

function Course({ course, setCourses }) {
    const [open, setOpen] = React.useState(false);
    const navigate = useNavigate();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return <Card style={{
        margin: 25,
        width: 350,
        minHeight: 200,
        padding: 15
    }}>
        <Typography textAlign={"center"} variant="h5">
            {course.title}
        </Typography>
        <Typography textAlign={"center"} variant="subtitle1">
            {course.description}
        </Typography>
        <div style={{ display: "flex", justifyContent: "center" }}>
            <img src={course.imageLink} style={{ width: 300 }}></img>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20 }}>
            <IconButton aria-label="delete" onClick={() => {
                navigate(`/courses/${course.id}`)
            }}>
                <EditIcon />
            </IconButton>
            <IconButton aria-label="delete" onClick={handleClickOpen}>
                <DeleteIcon />
            </IconButton>

            <Dialog open={open} onClose={handleClose} fullWidth={true}>
                <DialogTitle>Subscribe</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Type 'DELETE' to delete the course
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="conformation"
                        label="Confirm"
                        type="text"
                        fullWidth
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={async (e) => {
                        let confirm = document.getElementById("conformation");
                        if (confirm.value === "DELETE") {
                            console.log(course.id);
                            const response = await axios.delete(`${BASE_URL}/admin/courses/${course.id}`, {
                                headers: {
                                    "Authorization": localStorage.getItem("token")
                                }
                            })
                            if (response.data) {
                                console.log(response.data);
                                setCourses(response.data.courses);
                            }
                        } else {
                            alert("Type correctely");
                        }
                    }}>Delete</Button>
                </DialogActions>
            </Dialog>
        </div>
    </Card>
}

export default ShowCourses;