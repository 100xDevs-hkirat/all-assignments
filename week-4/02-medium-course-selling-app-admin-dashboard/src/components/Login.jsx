import React from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

/// File is incomplete. You need to add input boxes to take input for users to login.
function Login() {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const navigate = useNavigate();
    function login() {
        axios("http://localhost:3000/admin/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                username: email,
                password
            }
        }).then(res => res.data)
        .then(data => {
            console.log(data);
            if(data.token) {
                localStorage.setItem("token", data.token);
            }
            // redirect to landing page
            navigate('/');
        }).catch(err => console.log(err));
    }

    return <div>
        <h1>Login to admin dashboard</h1>
        <br/>
        Email - <input type={"text"} onChange={e => setEmail(e.target.value)} />
        Password - <input type={"text"} onChange={e => setPassword(e.target.value)} />
        <br/>
        <button onClick={login}>Login</button>
        <br/>
        New here? <a href="/register">Register</a>
    </div>
}

export default Login;