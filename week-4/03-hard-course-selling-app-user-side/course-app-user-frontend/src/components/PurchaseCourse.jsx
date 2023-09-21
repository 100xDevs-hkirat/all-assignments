import { Alert, Button, Card, Grid, Snackbar, TextField, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { purchasedCoursesState } from './stores/atoms/purchasedCourses'
import { BASE_URL } from "../config";
import { useRecoilState } from "recoil";

function PurchaseCourse() {
    const { courseId } = useParams("courseId");
    const [course, setCourse] = useState(null);
    const [open, setOpen] = useState(false);
    const [courseState, setCourseState] = useRecoilState(purchasedCoursesState);

    const handleClose = () => {
        setOpen(false);
    };

    const init = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/users/courses/${courseId}`, {
                headers: {
                    "Authorization": localStorage.getItem("token")
                }
            });
            if (response.data.course) {
                setCourse(response.data.course);
            } else {
                setCourse(null);
            }
        } catch (e) {
            setCourse(null);
        }
    }

    useEffect(() => {
        init();
    }, []);

    const onPress = async (e) => {
        const response = await axios.post(`${BASE_URL}/users/course/${courseId}`, {}, {
            headers: {
                "Authorization": localStorage.getItem("token")
            }
        });
        if (response.data.course) {
            setCourseState((prevArray) => [
                ...prevArray, course
            ]);
            setOpen(true);
        }
    }

    const check = () => {
        let course = courseState.find(course => parseInt(course.id) === parseInt(courseId));
        return course;
    }

    if (!course) {
        return <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
            <Typography variant="h3">
                Loding....
            </Typography>
        </div>
    } else {
        return <div>
            <div>
                <Grid container style={{ padding: "5vh" }}>
                    <Grid item lg={6} md={12} sm={12}>
                        <div style={{ display: "flex", justifyContent: "center", paddingTop: 140 }}>
                            <img src={course.imageLink} style={{ width: 400 }}></img>
                        </div>
                    </Grid>
                    <Grid item lg={6} md={12} sm={12}>
                        <div style={{ display: "flex", justifyContent: "center", paddingTop: 100 }}>
                            <Card style={{
                                padding: 30,
                                margin: 20
                            }}>
                                <div style={{ display: "flex", justifyContent: "center" }}>
                                    <Typography variant="h5">
                                        {course.title}
                                    </Typography>
                                </div>
                                <TextField
                                    fullWidth={true}
                                    id="filled-read-only-input"
                                    label="title"
                                    defaultValue={course.title}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    variant="filled"
                                    style={{ marginTop: 25 }}
                                />
                                <TextField
                                    fullWidth={true}
                                    id="filled-read-only-input"
                                    label="Description"
                                    defaultValue={course.description}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    variant="filled"
                                    style={{ marginTop: 20 }}
                                />


                                {!check() ? <div style={{ paddingTop: 25 }}>
                                    <Button variant="contained" onClick={(e) => {
                                        onPress(e);
                                    }}>
                                        {"$ @" + course.price}
                                    </Button>
                                </div> : <div style={{ display: "flex", paddingTop: 25 }}>
                                    <Button style={{ width: 100, marginRight: 10 }} variant="contained" color="success" onClick={(e) => {
                                    }} >
                                        Purchased
                                    </Button>
                                    <Button variant="contained" onClick={(e) => {
                                    }}>
                                        View Content
                                    </Button>
                                </div>}
                                <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                                    <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                                        Course Purchased
                                    </Alert>
                                </Snackbar>
                            </Card>
                        </div>
                    </Grid>
                </Grid>
            </div>
        </div>
    }
}

export default PurchaseCourse;