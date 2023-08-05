import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import SignInICon from '@mui/icons-material/VpnKey';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Copyright from './Copyright';
import { Snackbar } from '@mui/material';
import axios from '../config/requestLibrary';

// TODO remove, this demo shouldn't need to reset the theme.
let isAuthenticated = false, resp= null;

const defaultTheme = createTheme();

const check_token_state = () => {
  const [validated, getTokenExpiryState] = React.useState(false);

  React.useEffect(() => {
    const tokenDetails = async () => {
      if(localStorage.getItem('accessToken')){
        try {
          const response = await axios.get(`/tokenValidator`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
          });
          response.status === 200 ? getTokenExpiryState(true): getTokenExpiryState(false);
        } catch (error) {
          getTokenExpiryState(false);
        }
      }else{
        getTokenExpiryState(false);
      }
    };

    tokenDetails();
  }, []);

  // Return the course details or perform any other logic
  return validated;
}

export default function Login() {
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
  //   const response = await fetch("http://localhost:3000/users/login", {
  //     method: "POST",
  //     headers:{
  //         'username': data.get('email'),
  //         'password': data.get('password'),
  //         'Content-type':'application/json'
  //     }
  // });

  // resp = await response.json();
  // if(response.status === 200){
  //   isAuthenticated = true;
  //   localStorage.setItem('accessToken', resp.token);
  // }
  // response.status === 401 && alert(resp.message);
    try{
      const response = await axios({
        method: 'post',
        url: '/users/login',
        headers:{
          'username': data.get('email'),
          'password': data.get('password'),
      }
      });
      if(response.status === 200){
        isAuthenticated = true;
        localStorage.setItem('accessToken', response.data.token);
        navigate('/courses');
      }
    }catch(err){
      err.response.status === 401 && alert(err.response.data.message);
    }
  };
  isAuthenticated = check_token_state();

  //console.log(`Authenticated=> ${isAuthenticated}`);
  
  if(!isAuthenticated){
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
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <SignInICon/>
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Username or Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="/register" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
          <Copyright sx={{ mt: 8, mb: 4 }} />
        </Container>
      </ThemeProvider>
    );
  }else{
    return navigate('/courses');
  }
}

