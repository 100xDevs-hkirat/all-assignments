import { Button, Card, Grid, TextField, Typography } from "@mui/material";
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { courseState } from './stores/atoms/course';
import { useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../config";
import { useEffect, useState } from "react";
import { courseDescription, courseImageLink, coursePrice, courseTitle, isCourseLoading } from './stores/selector/course'

function EditCourse() {
    const setCourse = useSetRecoilState(courseState);
    const loading = useRecoilValue(isCourseLoading);
    const { courseId } = useParams("courseId");

    const populateCourse = async () => {
        const response = await axios.get(`${BASE_URL}/admin/courses/${courseId}`, {
            headers: {
                "Authorization": localStorage.getItem("token")
            }
        });
        if (response.data.course) {
            setCourse({
                isLoading: false,
                course: response.data.course
            })
        }
    }
    useEffect(() => {
        populateCourse();
    }, []);

    if (loading) {
        return <div>
            <Typography variant="h3">
                Loading...
            </Typography>
        </div>
    }
    return <div>
        <div style={{ marginTop: 20, display: "flex", justifyContent: "center" }}>
            <Typography variant="h3">
                Edit Course
            </Typography>
        </div>
        <div>
            <Grid container style={{ padding: "5vh" }}>
                <Grid item lg={6} md={12} sm={12}>
                    <UpdateCard></UpdateCard>
                </Grid>
                <Grid item lg={6} md={12} sm={12}>
                    <CourseCard />
                </Grid>
            </Grid>
        </div>
    </div>
}

function CourseCard() {
    const title = useRecoilValue(courseTitle);
    const description = useRecoilValue(courseDescription);
    const price = useRecoilValue(coursePrice);
    const imageLink = useRecoilValue(courseImageLink);

    return <div style={{ paddingTop: 50, display: "flex", justifyContent: "center" }}>
        <Card style={{ width: 400 }}>
            <Typography textAlign={"center"} variant="h5" style={{ paddingTop: 10 }}>
                {title}
            </Typography>
            <Typography textAlign={"center"} variant="subtitle1" style={{ paddingTop: 5 }}>
                {description}
            </Typography>
            <div style={{ display: "flex", justifyContent: "center", padding: 20 }}>
                <img src={imageLink} style={{ width: 360 }}></img>
            </div>
            <div style={{ margin: 10 }}>
                <Typography variant="h6" color={"Highlight"}>
                    {"$" + price}
                </Typography>
            </div>
        </Card>
    </div>
}

function UpdateCard() {
    const [courseDetails, setCourse] = useRecoilState(courseState);

    const [title, setTitle] = useState(courseDetails.course.title);
    const [description, setDescription] = useState(courseDetails.course.description);
    const [price, setPrice] = useState(courseDetails.course.price);
    const [imageLink, setImage] = useState(courseDetails.course.imageLink);

    useEffect(() => {
        setTitle(courseDetails.course.title);
        setDescription(courseDetails.course.description);
        setPrice(courseDetails.course.price);
        setImage(courseDetails.course.imageLink);
    }, [courseDetails])

    return <div style={{ display: "flex", justifyContent: "center", paddingTop: 50 }}>
        <Card style={{
            width: 450,
            padding: 30
        }}>
            <TextField
                id="title"
                value={title}
                style={{ marginBottom: 15 }}
                fullWidth={true}
                label="Title"
                variant="outlined"
                onChange={(e) => {
                    setTitle(e.target.value);
                }}
            />
            <TextField
                id="description"
                value={description}
                style={{ marginBottom: 15 }}
                fullWidth={true}
                label="Description"
                variant="outlined"
                onChange={(e) => {
                    setDescription(e.target.value);
                }}
            />

            <TextField
                id="image"
                value={imageLink}
                style={{ marginBottom: 15 }}
                fullWidth={true}
                label="Image link"
                variant="outlined"
                onChange={(e) => {
                    setImage(e.target.value);
                }}
            />
            <TextField
                id="price"
                value={price}
                style={{ marginBottom: 15 }}
                fullWidth={true}
                label="Price"
                variant="outlined"
                type="number"
                onChange={(e) => {
                    setPrice(e.target.value);
                }}
            />

            <div style={{ paddingTop: 15 }}>
                <Button variant="contained" onClick={async (e) => {
                    const response = await axios.put(`${BASE_URL}/admin/courses/${courseDetails.course.id}`, {
                        title: title,
                        description: description,
                        imageLink: imageLink,
                        price: parseInt(price),
                        published: true
                    }, {
                        headers: {
                            "Authorization": localStorage.getItem("token")
                        }
                    });
                    if (response.data) {
                        console.log(response.data);
                        setCourse({
                            isLoading: false,
                            course: response.data.course
                        });
                    }
                }}>
                    Update Course
                </Button>
            </div>
        </Card>
    </div>
}

export default EditCourse;