import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

function Nav() {
    return <>
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}  
                >
                    
                </IconButton>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Admin
                </Typography>
                    <a href="/register" style={{textDecoration:"none", color:"White", fontSize:"23px", margin:"20px"}}>Signup</a>  
                    <a href="/login" style={{textDecoration:"none", color:"White", fontSize:"23px", margin:"10px"}}>Login</a>  
            </Toolbar>
            </AppBar>
        </Box>
    </>
}

export default Nav;