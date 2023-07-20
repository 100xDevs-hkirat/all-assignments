// AllCourse.js
import React from 'react';
import Grid from '@mui/material/Grid';
import Course from './Course';

const AllCourse = () => {
  // Sample course data (you can fetch real data from an API)
  const courses = [
    { id: 1, title: 'Course 1', description: 'Description for Course 1' ,price :1000},
    { id: 2, title: 'Course 2', description: 'Description for Course 2' ,price :1000},
    { id: 3, title: 'Course 3', description: 'Description for Course 3' ,price :1000},
    // Add more course objects here as needed
  ];

  return (
    <Grid container spacing={2}>
      {courses.map((course) => (
        <Grid item key={course.id} xs={12} sm={6} md={4} lg={3}>
              <Course title={course.title} description={course.description} price={ course.price} />
        </Grid>
      ))}
    </Grid>
  );
};

export default AllCourse;
