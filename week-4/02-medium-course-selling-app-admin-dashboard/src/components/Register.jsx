import React from "react";
import { useNavigate } from "react-router-dom";

/// File is incomplete. You need to add input boxes to take input for users to register.
function Register() {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const navigate = useNavigate();
    function register() {
        console.log("hii")
        fetch("http://localhost:3000/admin/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: email,
                    password: password
                    })
                })
                .then(res => res.json())
                .then(data => {
                    console.log(data);
                    if(data.token) {
                        navigate('/');
                        localStorage.setItem("token", data.token);
                    }
                }
            )
    }
    return <div>
        <h1>Register to the website</h1>
        <br/>
        {email}
        {password}
        <input type={"text"} onChange={e => setEmail(e.target.value)} />
        <input type={"text"} onChange={e => setPassword(e.target.value)} />
        <button onClick={register}>Register</button>
        <br/>
        Already a user? <a href="/login">Login</a>
    </div>
}

export default Register;