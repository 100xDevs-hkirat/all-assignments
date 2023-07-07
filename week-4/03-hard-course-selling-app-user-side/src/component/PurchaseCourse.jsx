import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, CardMedia, Typography, Link, Grid, Button } from '@mui/material';
import { useParams } from 'react-router-dom';
import NaveBar from './NavBar';

const getCourse = (courseId) => {
    const [course, setCourse] = useState(null);
    const token = localStorage.getItem('userToken');

    useEffect(() => {
        fetch("http://localhost:3000/users/courses", {
            headers: {
                Authorization: token,
            },
        })
            .then((res) => res.json())
            .then((data) => data.courses)
            .then((courses) => courses.find(course => course.id === courseId))
            .then(course => setCourse(course));

    }, [])

    return course;
}

const PurchaseCourse = () => {
    const courseId = parseInt(useParams().courseId)
    const course = getCourse(courseId);
    const token = localStorage.getItem('userToken');

    if (course == null)
    {
        return <Box>Course not found</Box>
    }

    const purchaseCourse = () => {
        fetch(`http://localhost:3000/users/courses/${courseId}`, {
            method: 'POST',
            headers: {
                Authorization: token,
            },
        })
            .then((res) => res.json())
            .then((data) => alert(data.message));
    }
   
    return (
        <Box>
            <NaveBar/>
            <Card sx={{ display: 'flex', maxWidth: 600, padding: 1.5, margin: 'auto',  }}>
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
                        <Button variant="contained" size='small' sx={{ marginTop: 1 }} onClick={purchaseCourse}>
                           Purchase Course
                        </Button>
                    </CardContent>
                </Box>
        </Card>
        </Box>
    )
}

export default PurchaseCourse