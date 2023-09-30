import React from "react";
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

function Landing() {
    return <>
        <div style={{display:"flex", alignItems:"center", justifyContent:"center", height:"87vh"}}>
        <Card style={{padding:"40px"}}>
            <h1>Welcome to course purchase website!</h1>
            <a href="/register">Register</a>
            <br/>
            <a href="/login">Login</a>
        </Card>
        </div>
    </>   
}

export default Landing;