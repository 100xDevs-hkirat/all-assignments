// MyCard.js
import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const Course = ({ title, description, price ,id}) => {
    function details(value) { 
        //console.log(e.target.value);
        console.log(value);
    }
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
          <Link to={`/course/${id}`}>Details</Link>
    </Card>
  );
};

export default Course;
