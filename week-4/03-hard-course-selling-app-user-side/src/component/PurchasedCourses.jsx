import React from 'react'
import { Box, Card, CardContent, CardMedia, Typography, Link, Grid, Button } from '@mui/material';
import NaveBar from './NavBar'
import { useState } from 'react';
import { useEffect } from 'react';

const getCourses = () => {
    const [courses, setCourses] = useState([]);
    const token = localStorage.getItem('userToken');

    useEffect(() => {
        fetch("http://localhost:3000/users/purchasedCourses", {
            headers: {
                Authorization: token,
            },
        })
            .then((res) => res.json())
            .then((data) => data.purchasedCourses)
            .then((courses) => setCourses(courses));

    }, [])

    return courses;
}

const PurchasedCourses = () => {
    const courses = getCourses();
    return (
        <Box>
            <NaveBar />
                {
                    courses.map(course => <Course id = {course.id} course={course} />)
                }
        </Box>
    )
}

const Course = ({ course }) => {
    return (
        <Card sx={{ display: 'flex', padding: 1.5,marginY: 3, marginX: 20 }}>
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
                        {course.description}
                    </Typography>
                </CardContent>
            </Box>

        </Card>
    )
}

export default PurchasedCourses