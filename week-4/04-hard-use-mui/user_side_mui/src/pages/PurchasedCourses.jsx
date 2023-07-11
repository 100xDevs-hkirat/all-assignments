import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPurchasedCourses } from '../helpers/server.helper';
import TokenContext from '../helpers/TokenContext';
import { Container, Grid, Typography } from '@mui/material';
import Course from '../components/Course';

export default function PurchasedCourses() {
  const { jwtToken } = useContext(TokenContext);
  const navigate = useNavigate();
  const [purchaseCourses, setPurchaseCourses] = useState([]);

  useEffect(() => {
    if (!jwtToken) navigate('/login');
    getPurchasedCourses()
      .then((res) => setPurchaseCourses(res.data.purchaseCourses))
      .catch((error) => {
        if (error.response.status === 401) navigate('/login');
      });
  }, [jwtToken, navigate]);

  return (
    <Container>
      <Typography
        component="h2"
        variant="h4"
        textAlign="center">
        Purchased Courses
      </Typography>
      <Grid
        container
        marginTop={2.5}
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2.5,
          justifyContent: 'space-evenly',
        }}>
        {purchaseCourses.map(
          ({ title, description, price, imageLink }, idx) => (
            <Grid
              item
              key={idx}
              minWidth={360}>
              <Course
                title={title}
                description={description}
                price={price}
                imageLink={imageLink}
              />
            </Grid>
          )
        )}
      </Grid>
    </Container>
  );
}
