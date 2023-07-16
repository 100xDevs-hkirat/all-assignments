import React from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
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
        <h1>Register to the website</h1>
        <br/>
        Email
        <input type={"text"} onChange={e => setEmail(e.target.value)} />
        <br/>
        Password
        <input type={"text"} onChange={e => setPassword(e.target.value)} />
        Already a user? <a href="/login">Login</a>
        <button onClick={()=>{registerUser(email,password,navigate)}}> Register </button>
    </div>
}

export default Register;