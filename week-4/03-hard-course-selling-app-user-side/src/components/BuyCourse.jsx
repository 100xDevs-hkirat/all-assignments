import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Copyright from './Copyright';
import axios from '../config/requestLibrary';
import { useNavigate, useLocation } from 'react-router-dom';

// TODO remove, this demo shouldn't need to reset the theme.
let resp = null;
const defaultTheme = createTheme();

const fetch_course_details = (courseId) => {
    const [course, setCourseDetails] = React.useState({});
  
    React.useEffect(() => {
      const fetchCourseDetails = async () => {
        try {
          const response = await axios.get(`/admin/courses/${courseId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
          });
          if (response.status === 200) {
            setCourseDetails(response.data);
          }
        } catch (error) {
          console.error('Error fetching course details:', error);
        }
      };
  
      fetchCourseDetails();
    }, [courseId]);
  
    // Return the course details or perform any other logic
    return course;
  }

export default function BuyCourse() {
  const navigate = useNavigate();
  const location = useLocation();
  const courseId = location.pathname.split('/')[2];
  const course = fetch_course_details(courseId);
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    try{
      const response = await axios({
        method: 'post',
        url: `/users/courses/${courseId}`,
        headers:{
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        }
      });
      if(response.status === 200){
        alert(response.data.message);
        navigate('/courses');
      }
    }catch(err){
      err.response.status === 403 && alert(err.response.data.message);
    }
  };
  
  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          
          <Typography component="h1" variant="h4">
            Course Details
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
              {`Title: ${course.title}`}
              </Grid>
              <Grid item xs={12}>
              {`Description: ${course.description}`}
              </Grid>
              <Grid item xs={12}>
                {`Price: ${course.price}`}
              </Grid>
            </Grid>
            <Button
              type="submit"
              variant="contained"
              color="error"
              sx={{ mt: 3, mb: 2, gap:2, mrgin:2 }}
            >
              Buy
            </Button>
            <Button
              type="submit"
              variant="outlined"
              href="/courses"
              sx={{ mt: 3, mb: 2,  gap:2 }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
  
  
}