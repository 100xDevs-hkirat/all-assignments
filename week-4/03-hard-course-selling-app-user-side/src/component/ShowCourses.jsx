import React from 'react'
import { Box, Card, CardContent, CardMedia, Typography, Link, Grid, Button } from '@mui/material';
import NaveBar from './NavBar'
import { useState } from 'react';
import { useEffect } from 'react';

const getCourses = () => {
    const [courses, setCourses] = useState([]);
    const token = localStorage.getItem('userToken');

    useEffect(() => {
        fetch("http://localhost:3000/users/courses", {
            headers: {
                Authorization: token,
            },
        })
            .then((res) => res.json())
            .then((data) => data.courses)
            .then((courses) => setCourses(courses));

    }, [])

    return courses;
}

const ShowCourses = () => {
    const courses = getCourses();
    return (
        <Box>
            <NaveBar />
            <Grid sx={{ margin: 3 }}
                container
                direction="column"
                justifyContent="center"
                alignItems="center">
                {
                    courses.map(course => <Course id = {course.id} course={course} />)
                }
            </Grid>
        </Box>
    )
}

const Course = ({ course }) => {
    return (
        <Card sx={{ display: 'flex', maxWidth: 600, padding: 1.5 }}>
            <CardMedia
                component="img"
                sx={{ width: 151 }}
                image={course.imageLink}
                alt="Live from space album cover"
            />
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flex: '1 0 auto' }}>
                    <Typography component="div" variant="h6">
                        {course.title}
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary" component="div">
                        Price: {course.price}
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary" component="div">
                        {course.description.length <= 50 ? course.description : course.description.substring(0, 50)}
                    </Typography>
                    <Button  variant="contained" size='small' sx={{ marginTop : 1}}>
                        <Link color='inherit' underline='none' href={`/courses/${course.id}`}>View Detail</Link>
                    </Button>
                </CardContent>
            </Box>

        </Card>
    )
}

export default ShowCourses