import React from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
/// File is incomplete. You need to add input boxes to take input for users to register.

function registerUser(email,password,navigate){
    if (!email && !password) return;
    axios.post('http://localhost:3000/users/signup',{
      username : email,
      password : password
    })
      .then(response => {
        localStorage.setItem('userToken',response.data.token);
        console.log(localStorage.getItem('userToken'));
        navigate('/courses');
      })
      .catch(error => {
        console.error('User registration error:', error);
      });
}
function Register() {
    const [email, setEmail] = React.useState("");
    const [password,setPassword] = React.useState("");
    const navigate = useNavigate();
    return <div>
    <React.Fragment>
    <CssBaseline />
    <Container maxWidth="sm">
        <h1>Register to the website</h1>
        <br/>
        <TextField id="standard-basic" label="Email" variant="standard" onChange={e => setEmail(e.target.value)} />
        {/* <input type={"text"} onChange={e => setEmail(e.target.value)} /> */}
        <br/>
        <br />
        <TextField id="standard-basic" label="Password" variant="standard" onChange={e => setPassword(e.target.value)} />
        {/* <input type={"text"} onChange={e => setPassword(e.target.value)} /> */}
        <br/>
        <br/>
        <Button variant="outlined" onClick={()=>{registerUser(email,password,navigate)}}> Register </Button>
        <br/>Already a user? <a href="/login">Login</a>
    </Container>
    </React.Fragment>
    </div>
}

export default Register;