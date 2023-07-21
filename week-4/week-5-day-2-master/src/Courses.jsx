import { Card, Typography, Button } from "@mui/material";
import axios from "axios";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Courses() {
    const navigate = useNavigate()
    const [courses, setCourses] = useState([]);
    const token = localStorage.getItem("token")
    useEffect(() => {
        const fetchCourse = async () => {
            // function callback2(data) {
            //     setCourses(data.courses);
            // }
            // function callback1(res) {
            //     res.json().then(callback2)
            // }
            const res = await axios.get("http://localhost:3000/admin/courses/", {
                headers: {
                    "Authorization": "Bearer " + token
                }
            })
            if (res.statusText !== 'OK') {
                return
            }
            const data = res
            console.log(data)
            setCourses(data.data.courses)
        }
        fetchCourse()
    }, [token]);

    return <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
        {courses.map(course => {
            return <Course course={course} />
        }
        )}
    </div>
}

export function Course({ course }) {
    const navigate = useNavigate()
    return <Card style={{
        margin: 10,
        width: 300,
        minHeight: 200,
        padding: 20
    }} >

        <Typography textAlign={"center"} variant="h5">
            {course.title}

        </Typography>
        <Typography textAlign={"center"} variant="subtitle1">
            {course.description}

        </Typography>
        <img src=
            {course.imageLink}
            style={{ width: 300 }} ></img>
        <div style={{
            display: 'flex',
            justifyContent: 'center',

        }}>
            <Button variant='contained' size="large" onClick={() => {
                navigate(`/course/${course._id}`)
            }}>
                Edit
            </Button>
        </div>
    </Card>

}



export default Courses;