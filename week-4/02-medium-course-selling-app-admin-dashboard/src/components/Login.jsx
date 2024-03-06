import React from "react";
import { useNavigate } from "react-router-dom";
import useFetch from "./FetchData";

function Login() {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const navigateTo = useNavigate();
    const header = new Headers();
    header.append('content-type', 'application/json');
    header.append('username', email);
    header.append('password', password);
    const body = {};
    const fetch = useFetch("http://localhost:3000/admin/login", "POST", '/courses');

    return <div>
        <h1>Login to admin dashboard</h1>
        <br/>
        Email - <input type={"text"} onChange={event => setEmail(event.target.value)} />
        <br/>
        Password - <input type={"text"} onChange={event => setPassword(event.target.value)} />
        <br/>
        <button onClick={() => fetch(body, header)}>Login</button>
        <br/>
        New here? <a href="/register">Register</a>
    </div>
}

export default Login;