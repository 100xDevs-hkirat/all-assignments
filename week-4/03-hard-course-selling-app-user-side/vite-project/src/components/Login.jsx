import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 

function Login() {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const navigate = useNavigate();

    function login(event) {
        event.preventDefault();
        axios.post("http://localhost:3000/users/login", {}, {
            headers: {
                "Content-Type": "application/json",
                "username": email,
                password
            }
        }).then(res => {
            if(res.data.token) {
                localStorage.setItem("token", res.data.token);
            }
            navigate("/");
        }).catch(err => console.error(err));
    }

    return <div>
        <h1>Login Page</h1>
        <form onSubmit={login}>
            Email - <input type="email" onChange={e => setEmail(e.target.value)} />
            <br />
            Password - <input type="password" onChange={e => setPassword(e.target.value)} />
            <br />
            <button type="submit">Login</button>
        </form>
    </div>
}

export default Login;