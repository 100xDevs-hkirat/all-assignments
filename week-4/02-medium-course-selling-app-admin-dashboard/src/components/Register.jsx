import React, { useState } from "react";

/// File is incomplete. You need to add input boxes to take input for users to register.
function Register() {



    const [email, setEmail] = useState("")

    const [password, setPassword] = useState("")

    const [username, setUsername] = useState("")

    const registerAdmin = async () => {
        const Admin = {
            email: email,
            password: password,
            username: username
        }
        try {
            const response = await fetch("http://localhost:3000/admin/signup", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(Admin)
            })
        } catch (error) {

        }
    }

    return (<div>
        <h1>Register</h1>

        Enter email<input onChange={e => setEmail(e.target.value)} /><br></br>
        Enter Username<input onChange={e => setPassword(e.target.value)} /><br></br>
        Enter password<input onChange={e => setUsername(e.target.value)} /><br></br>
        <button onClick={registerAdmin}>Register</button>
        <br />
        Already a user? <a href="/login">Login</a>
    </div>)
}

export default Register;