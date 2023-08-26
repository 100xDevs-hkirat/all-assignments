
import React from "react";
import { Link } from "react-router-dom";
import Button from '@mui/material/Button';
import SnackBar from "./SnackBar";

/// This is the landing page. You need to add a link to the login page here.
/// Maybe also check from the backend if the user is already logged in and then show them a logout button
/// Logging a user out is as simple as deleting the token from the local storage.
function Landing() {
    return <div>
            <div style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "30vh",
                color: "white"
            }}>
            <h1>Welcome to course selling website!</h1>
            </div>
            <div style={{
                display: "flex",
                justifyContent: "center",
            }}>
            <Link to={"/login"}><Button style={{margin:"10px"}} variant="contained">Login</Button></Link>
            <Link to={"/register"}><Button style={{margin:"10px"}} variant="contained">Register</Button></Link>
            </div>
            
           </div>
        
}

export default Landing;