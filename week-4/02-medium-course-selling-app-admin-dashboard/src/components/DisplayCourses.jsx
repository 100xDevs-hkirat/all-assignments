import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import DeleteIcon from '@mui/icons-material/Delete';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import IconButton from '@mui/material/IconButton';
import HomeIcon from '@mui/icons-material/Home';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Copyright from './Copyright';
import axios from '../config/requestLibrary';
import LogoutIcon from '@mui/icons-material/Logout';

let data = [];

const fetch_courses = async () => {
    try{
        const response = await axios({
          method: 'get',
          url: '/admin/courses',
          headers:{
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        }
        });
        if(response.status === 200){
            return response;
        }
      }catch(err){
        err.response.status === 403 && alert(err.response.data.message);
        return null;
      }
}

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function DisplayCourse() {
    let [COURSES, getCourses] = React.useState(data);
    
    React.useEffect(() => {
      const retreiveCourse = async() => {
        try{
          const response = await fetch_courses();
          response.status === 200 ? getCourses(response.data.courses) : getCourses([]);
        }catch(err){
          getCourses({});
        }
      }
      retreiveCourse();
    }, []);
    const logOut = () => {
        localStorage.removeItem('accessToken');
        // redirect back home after logging out
        window.location.href='/'; 
    }
  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
            <IconButton href="/" sx={{ mr: 2 }} size="large">
                <HomeIcon color='white'/>
            </IconButton>
          <LocalLibraryIcon sx={{ mr: 2 }}/>
          <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
            Course Encyclopedia
          </Typography>
          <Button startIcon={<LogoutIcon />} variant="contained" onClick={logOut}>Log out</Button>
        </Toolbar>
      </AppBar>
      <main>
        {/* Hero unit */}
        <Box
          sx={{
            bgcolor: 'background.paper',
            pt: 8,
            pb: 6,
          }}
        >
          <Container maxWidth="m">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="text.primary"
              gutterBottom
            >
              Courses Arena
            </Typography>
            
            <Stack
              sx={{ pt: 4 }}
              direction="row"
              spacing={2}
              justifyContent="center"
            >
              <Button startIcon={<ControlPointIcon />} variant="contained" href="/create">Add new</Button>
              <Button startIcon={<DeleteIcon />} variant="outlined" href="" color="error">Delete</Button>
            </Stack>
          </Container>
        </Box>









        
        <Container sx={{ py: 8 }} maxWidth="md">
          {/* End hero unit */}
          <Grid container spacing={4}>
            {COURSES.map((card) => (
              <Grid item key={card} xs={12} sm={6} md={4}>
                <Card
                  sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                >
                  <CardMedia
                    component="div"
                    sx={{
                      // 16:9
                      pt: '56.25%',
                    }}
                    image={card.imageLink}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {card.title}
                    </Typography>
                    <Typography>
                      {card.description}
                    </Typography>
                  </CardContent>
                  <CardActions >
                  <Typography gutterBottom variant="h5" component="h2">
                      {`₹${card.price}`}
                    </Typography>
                    <Button size="small" href={`/courses/${card._id}`}>View</Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </main>








      {/* Footer */}
      <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
        <Copyright />
      </Box>
      {/* End footer */}
    </ThemeProvider>
  );
}