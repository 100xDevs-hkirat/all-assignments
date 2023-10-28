import React from "react";
import axios from 'axios';

/// File is incomplete. You need to add input boxes to take input for users to login.
function Login() {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    const handleLogin = () => {
        axios.post('http://localhost:3000/admin/login', {}, {
            headers: {
                'Content-Type': 'multipart/form-data',
                "username": email,
                "password": password
            }
        })
            .then(function (response) {
                console.log(response.data.message);
                localStorage.setItem('token', response.data.token);
                alert(response.data.message);
            })
            .catch(function (error) {
                console.log(error.response.data);
                alert(error.response.data.message);
            });
    }
    return <div>
        <h1>Login to admin dashboard</h1>
        <br />
        Email - <input type={"text"} onChange={e => setEmail(e.target.value)} />
        <br />
        <br />
        Password - <input type={"text"} onChange={e => setPassword(e.target.value)} />
        <br />
        <button onClick={handleLogin}>Login</button>
        <br />
        New here? <a href="/register">Register</a>
    </div>
}

export default Login;