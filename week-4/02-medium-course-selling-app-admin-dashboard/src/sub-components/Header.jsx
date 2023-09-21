import { Box, AppBar, Toolbar, Typography, Button  } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [loggedIn, setLoggedIn] = useState(null);

  useEffect(()=>{
    fetch('http://localhost:3000/admin/profile', { headers: {"Authorization": "Bearer " + localStorage.getItem("token")}})
    .then(res => res.json())
    .then(data => {
      setUsername(data.username);
      setLoggedIn(true);
    })
    .catch(error => {
      console.error('Error fetching username', error);
      setLoggedIn(false);
    })
  }, []);

  const handleLogin = () => {
    navigate('/login');
  }

  const handleSignup = () => {
    navigate('/register');
  }

  const handleLogout = () => {
    localStorage.setItem("token", null);
    setLoggedIn(false);
    setUsername('');
  }

    return (
      <Box>
        <AppBar position="static">
        <Toolbar>
          {loggedIn ? (
            <Typography variant='h6' component="div" sx={{ flexGrow: 1 }} onClick={() => {
              navigate("/")
            }}>
              CourseWise
            </Typography>
          ):(
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>CourseWise</Typography>
          )}
          {loggedIn ? (
            <>
              <Typography variant="subtitle1" component="span" sx={{ marginRight: '1rem' }}> {username} </Typography>
              <Button color='inherit' onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            <> 
              <Button color="inherit" onClick={handleSignup}>Register</Button>
              <Button color="inherit" onClick={handleLogin}>Login</Button>
              </>
          )}
        </Toolbar>
      </AppBar>
      </Box>
    )
}
