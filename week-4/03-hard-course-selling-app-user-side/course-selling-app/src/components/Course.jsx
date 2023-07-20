// MyCard.js
import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

const Course = ({ title, description ,price}) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="h2">
          {title}
        </Typography>
        <Typography color="textSecondary">
          {description}
              </Typography>
              <Typography color="textSecondary">
          {price}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default Course;
