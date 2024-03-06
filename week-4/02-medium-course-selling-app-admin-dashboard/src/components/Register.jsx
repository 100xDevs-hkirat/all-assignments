import React from "react";
import { useNavigate } from "react-router-dom";
import useFetch  from "./FetchData";

function Register() {
    const [email, setEmail] = React.useState("");
    const [Password, setPassword] = React.useState("");
    const body = {
        username: email,
        password: Password
      };
    const header = new Headers();
    header.append('content-type', 'application/json');
    const fetch = useFetch("http://localhost:3000/admin/signup", "POST", '/courses');

    return <div>
        <h1>Register to the website</h1>
        <br/>
        <h5 style={{display: "inline"}}>Username: </h5>
        <input type={"text"} onChange={event => setEmail(event.target.value)}/>
        <br/>
        <h5 style={{display: "inline"}}>Password: </h5>
        <input type={"text"} onChange={event => setPassword(event.target.value)}/>
        <button onClick={() => fetch(body, header)}>Sign up</button>
        <p>Already a user? </p><a href="/login">Login</a>
    </div>
}

export default Register;