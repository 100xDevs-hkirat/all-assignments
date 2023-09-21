import { Button, Card, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../config';
import { useNavigate } from 'react-router-dom';

function Courses() {
    const [courses, setCourses] = useState([]);

    const populateCourses = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/users/courses`, {
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
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
                    {courses.map((course) => {
                        return <div>
                            <Course key={course.id} course={course} />
                        </div>
                    })}
                </div>
            </div>
        </div>
    }
}

function Course({ course }) {
    const navigate = useNavigate();

    return <Card style={{
        margin: 25,
        width: 300,
        minHeight: 200,
        padding: 20
    }}>
        <Typography textAlign={"center"} variant="h5">
            {course.title}
        </Typography>
        <Typography textAlign={"center"} variant="subtitle1">
            {course.description}
        </Typography>
        <img src={course.imageLink} style={{ width: 300 }}></img>
        <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
            <Button variant="contained" size="large" onClick={() => {
                navigate("/course/" + course.id);
            }}>Buy</Button>
        </div>
    </Card>
}

export default Courses;