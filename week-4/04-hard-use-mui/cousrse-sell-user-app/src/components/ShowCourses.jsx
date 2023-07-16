import React from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import { Button } from "@mui/material";
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Link from '@mui/material/Link';
function getCourses(setCourses) {
    axios.get('http://localhost:3000/users/courses', {
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('userToken')
        }
    })
        .then(response => {
            setCourses(response.data.courses);
        })
        .catch(error => {
            console.error('Course Fetch error:', error);
        });
}

function purchaseCourse(courseId) {
    if (!courseId) {
        console.log("Course Id null");
        return;
    }
    axios.post('http://localhost:3000/users/courses/' + courseId, {}, {
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('userToken')
        }
    })
        .then(response => {
            console.log("Course Purchased")
        })
        .catch(error => {
            console.error('Course Fetch error:', error);
        });
}

function logUserOut(navigate) {
    localStorage.removeItem('userToken');
    navigate('/')
}

function ShowCourses() {
    const [courses, setCourses] = React.useState([]);
    const navigate = useNavigate();
    React.useEffect(() => {
        getCourses(setCourses);
        const timeout = setInterval(() => {
            getCourses(setCourses);
        }, 5000);
        return () => clearInterval(timeout);
    }, [])
    return <div>
        <CssBaseline />
        <Container maxWidth="sm">
            <Grid container spacing={2}>
                <Grid item xs={8}>
                    <h1>Courses</h1>
                </Grid>
                <Grid item xs={8}>
                    <Link href="/purchased">List of Purchased Courses </Link>
                </Grid>
                <Grid item xs={4}>
                    <Button variant="outlined" onClick={() => logUserOut(navigate)}> LogOut </Button>
                </Grid>
                <Grid item xs={12}>
                    <List>
                        {courses.map(c => <Course title={c.title} courseId={c.id} setCourses={setCourses} />)}
                    </List>
                </Grid>
            </Grid>
        </Container>
    </div>
}

function Course(props) {
    return <div>
        <ListItemText>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    Title : {props.title}
                </Grid>
                <Grid item xs={6}>
                    <Button variant="outlined" onClick={() => purchaseCourse(props.courseId)}> Purchase Course</Button>
                </Grid>
            </Grid>
        </ListItemText>
    </div>
}

export default ShowCourses;