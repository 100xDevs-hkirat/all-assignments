import { Box, AppBar, Toolbar, Typography, Button  } from '@mui/material';

export default function Header() {
    return (
      <Box>
        <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <a href="/" style={{color: 'white', textDecoration:'none'}}> CourseWise </a>
          </Typography>
          <Button href="/register" color="inherit">Register</Button>
          <Button href="/login" color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
      </Box>
    )
}
