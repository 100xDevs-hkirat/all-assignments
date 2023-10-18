import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { useEffect, useState } from "react";
import {useNavigate} from "react-router-dom";

function Nav() {
    // const navigate = useNavigate();  
    const [username, setUserName] = useState(null);

    useEffect(() => {
        console.log("token - " + localStorage.getItem("token"));
        fetch("http://localhost:3000/admin/me", {
            method:"GET",
            headers: {
                "token": "Bearer " + localStorage.getItem("token")
            }
        })
    }, [])

    if(username) {
        return <div style={{marginLeft: 10}}>
                <Typography variant={"h6"}>Coursera</Typography>

                <div style={{display: "flex"}}>
                    <div style={{marginRight: 10, display: "flex"}}>
                    <div style={{marginRight: 10}}>
                            <Button
                                // onClick={() => {
                                //     navigate("/addcourse")
                                // }}
                            >Add course</Button>
                        </div>

                        <div style={{marginRight: 10}}>
                            <Button
                                // onClick={() => {
                                //     navigate("/courses")
                                // }}
                            >Courses</Button>
                        </div>

                        <Button
                            variant={"contained"}
                            onClick={() => {
                                localStorage.setItem("token", null);
                                window.location = "/";
                            }}
                         >Logout</Button>
                        </div>
                    </div>
                </div>
    }
    else {

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
}

export default Nav;