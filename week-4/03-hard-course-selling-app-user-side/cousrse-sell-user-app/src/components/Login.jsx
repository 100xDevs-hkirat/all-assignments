import React from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
/// File is incomplete. You need to add input boxes to take input for users to register.

function loginUser(email,password,navigate){
    if (!email && !password) return;
    axios.post('http://localhost:3000/users/login',{},{headers : {
        username : email,
        password : password
      }})
      .then(response => {
        localStorage.setItem('userToken',response.data.token);
        console.log(localStorage.getItem('userToken'));
        navigate('/courses');
      })
      .catch(error => {
        console.error('User registration error:', error);
      });
}
function Login() {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const navigate = useNavigate();
    return <div>
        <h1>Login to admin dashboard</h1>
        <br/>
        Email - <input type={"text"} onChange={e => setEmail(e.target.value)} />
        <br/>
        <br/>
        Password - <input type={"text"} onChange={e => setPassword(e.target.value)} />
        <br/>
        <button onClick={() => {loginUser(email,password,navigate)}} href='/'>Login</button>
        <br/>
        New here? <a href="/register">Register</a>
    </div>
}

export default Login;