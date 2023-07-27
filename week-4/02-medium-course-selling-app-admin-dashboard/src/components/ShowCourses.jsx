/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-key */
import React, { useEffect } from "react";
import { Card, Grid, Box, CardContent, CardMedia, Typography, Button } from '@mui/material';
import { useNavigate } from "react-router-dom";

function ShowCourses() {
    const [courses, setCourses] = React.useState([]);

    // Add code to fetch courses from the server
    // and set it in the courses state variable.

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

    return (
        <div>
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <Box maxWidth={800}>
                    <Typography variant="h4" component="h4" align="center" gutterBottom> Courses </Typography>
                    <Grid container spacing={2} justifyContent="center">
                        {courses?.map((course) => (
                        <Grid item xs={12} sm={6} md={4} key={course.title}>
                        <Course course={course} />
                        </Grid>
                        ))}
                    </Grid>
                </Box>
            </Box>
        </div>
    )
}

function Course({ course }) {
    const { title, description, price, image, published} = course ;
    const navigate = useNavigate();

    const handleEdit = () => {
        navigate("/course/:courseId");
    }

    return(
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
            <Button variant="contained" onClick={handleEdit}>Edit</Button>
		</CardContent>
	</Card>
    )
}

export default ShowCourses;