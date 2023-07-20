import { Box, AppBar, Toolbar, Typography, Button  } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();
    return (
      <Box>
        <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <a href="/" style={{color: 'white', textDecoration:'none'}}> CourseWise </a>
          </Typography>
          <Button color="inherit" onClick={() => {
            navigate("/register")
          }}>Register</Button>
          <Button color="inherit" onClick={() => {
            navigate("/login")
          }}>Login</Button>
        </Toolbar>
      </AppBar>
      </Box>
    )
}
