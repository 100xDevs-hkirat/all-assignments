import React from "react";
import axios from "axios";

function Login() {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    function login(event) {
        event.preventDefault();
        axios.post("http://localhost:3000/users/login", {}, {
            headers: {
                "Content-Type": "application/json",
                "username": email,
                password
            }
        }).then(res => console.log(res.data))
        .catch(err => console.error(err));
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