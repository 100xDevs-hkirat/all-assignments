/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactLoading from 'react-loading';
import { Card, CardMedia, CardContent, Typography, TextField, Button } from "@mui/material";

function Course () {
    let { courseId } = useParams();
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3000/admin/courses/', {
                                headers: {
                                    "Authorization": "Bearer " + localStorage.getItem("token")
                                }
                            }).then((res) => {
                                res.json().then((data) => {
                                    setCourses(data.courses);
                                })
                            })
    }, [])

    let course = null;
    for (let i =0; i<courses.length; i++) {
        if(courses[i].id == courseId) {
            course = courses[i]
        }
    }

    if(!course) {
        return (
            <div style={{ display: 'flex', justifyContent: "center", marginTop:150}}>
                <ReactLoading type="spin" color="#1c8fed"/>
            </div>
        )
    }

    return (
        <>
            <CourseCard course = {course}/>
            <UpdateCard courses = {courses} course = {course} setCourses = {setCourses} />
        </>
    )
}

function CourseCard({ course }) {
    const { title, description, price, image, published} = course ;
    return (
        <div style={{ display: 'flex', justifyContent: "center", marginTop:20}}>
            <Card sx={{ maxWidth: 345 }}>
                <CardMedia
                sx={{ height: 140 }}
                image={image}
                title={title}
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div"> {title} </Typography>
                    <Typography variant="body2" color="text.secondary"> {description} </Typography>
                    <Typography variant="body2" color="text.secondary"> Price: {price} </Typography>
                    <Typography variant="body2" color="text.secondary"> Published: {published ? "Yes" : "No"} </Typography>
                </CardContent>
            </Card>
        </div>
    )
}

function UpdateCard({course, courses, setCourses}) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [image, setImage] = useState("");
    const [published, setPublished] = useState(false);

    return (
        <div style={{ display: 'flex', justifyContent: "center", marginTop:20}}>
            <Card sx={{ minWidth: 275 }} style={{width: 400, padding: 20}}>
                <div>
                    <TextField fullWidth={true} variant="outlined" label="Title" type={"text"} onChange={e => setTitle(e.target.value)} />
                    <br /><br />
                    <TextField fullWidth={true} variant="outlined" label="Description" type={"text"} onChange={e => setDescription(e.target.value)} />
                    <br /> <br />
                    <TextField fullWidth={true} variant="outlined" label="Price" type={"number"} onChange={e => setPrice(e.target.value)} />
                    <br /> <br />
                    <TextField fullWidth={true} variant="outlined" label="Image Link" type={"url"} onChange={e => setImage(e.target.value)}/>
                    <br /> <br />
                    <TextField fullWidth={true} variant="outlined" label="Published" type={""} onChange={e => setPublished(e.target.value)}/>
                    <br /> <br />
                    <div style={{display:'flex', justifyContent:'space-between'}}>
                        <Button variant="contained" onClick={() => {
                            fetch("http://localhost:3000/admin/courses/" + course.id, {
                                method: "PUT",
                                body: JSON.stringify({
                                    title,
                                    description,
                                    price,
                                    image,
                                    published
                                }),
                                headers: {
                                    "Content-type": "application/json",
                                    "Authorization": "Bearer " + localStorage.getItem("token")
                                }
                            }).then((res) => {
                                res.json().then(() => {
                                    let updateCourses = [];
                                    for (let i=0; i<courses.length; i++){
                                        if( courses[i].id == course.id) {
                                            updateCourses.push({
                                                id: course.id,
                                                title,
                                                description,
                                                price,
                                                image,
                                                published
                                            })
                                        } else {
                                            updateCourses.push(courses[i]);
                                        }
                                    }
                                    setCourses(updateCourses);
                                })
                            })
                        }}>
                            Update
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    )

}

export default Course;