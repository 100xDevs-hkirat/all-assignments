import React from "react";
import axios from 'axios';

/// File is incomplete. You need to add input boxes to take input for users to register.
function Register() {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    const handleSignup = () => {
        axios.post('http://localhost:3000/admin/signup', {
            "username": email,
            "password": password
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
        <h1>Register to the website</h1>
        <br />
        Email - <input type={"text"} onChange={e => setEmail(e.target.value)} />
        <br />
        <br />
        Password - <input type={"text"} onChange={e => setPassword(e.target.value)} />
        <br />
        <br />
        <button onClick={handleSignup}>Login</button>
        <br />
        <br />
        Already a user? <a href="/login">Login</a>
    </div>
}

export default Register;