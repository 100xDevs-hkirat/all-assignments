import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCourses } from '../helpers/server.helper';
import TokenContext from '../helpers/TokenContext';
import Course from '../components/Course';
import { Container, Grid, Typography } from '@mui/material';

export default function ShowCourses() {
  const { jwtToken } = useContext(TokenContext);
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    if (!jwtToken) navigate('/login');
    getCourses()
      .then((res) => setCourses(res.data.courses))
      .catch((error) => {
        if (error.response.status === 401) {
          localStorage.removeItem('jwt_token');
          navigate('/login');
        }
      });
  }, [jwtToken, navigate]);

  return (
    <Container>
      <Typography
        component="h2"
        variant="h4"
        textAlign="center">
        Courses
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
        {courses.map(
          ({ courseId, title, description, price, imageLink }, idx) => (
            <Grid
              item
              key={idx}
              minWidth={360}
              onClick={() => navigate(`/courses/${courseId}`)}>
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
