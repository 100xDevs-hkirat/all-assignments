import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCourses, buyCourse } from '../helpers/server.helper';
import Course from '../components/Course';
import TokenContext from '../helpers/TokenContext';
import { Box, Container, Typography } from '@mui/material';

export default function BuyCourse() {
  const { courseId } = useParams();
  const { jwtToken } = useContext(TokenContext);
  const [course, setCourse] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    if (!jwtToken) navigate('/login');
    getCourses()
      .then((res) => {
        const course = res.data.courses.find((c) => c.courseId == courseId);
        if (!course) navigate('/courses');
        setCourse(course);
      })
      .catch((error) => {
        if (error.response.status === 401) navigate('/login');
      });
  }, [courseId, jwtToken, navigate]);

  function handleBuy() {
    buyCourse(courseId)
      .then(() => navigate('/courses/purchased'))
      .catch((error) => {
        if (error.response.status === 401) navigate('/login');
      });
  }

  return (
    <Container>
      <Typography
        component="h2"
        variant="h4"
        textAlign="center">
        Buy Course
      </Typography>
      <Box
        marginTop={2.5}
        sx={{ display: 'flex', justifyContent: 'center' }}>
        <Course
          title={course?.title}
          description={course?.description}
          price={course?.price}
          imageLink={course?.imageLink}
          onClick={handleBuy}
          buttonMessage={'Buy Course'}
        />
      </Box>
    </Container>
  );
}
