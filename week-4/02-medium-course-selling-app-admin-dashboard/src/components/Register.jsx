import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

/// File is incomplete. You need to add input boxes to take input for users to register.
function Register() {
    const [email, setEmail] = React.useState("");
    const [password, setpassword] = React.useState("");
    const [error, setError] = useState('')
    const onRegister = async (e) => {
        e.preventDefault()
        if (email.length === 0 && password.length === 0) {
            setError('The Input Field should not be empty')
        }
        try {
            const response = await fetch(`http://localhost:3000/users/signup`, {
                method: "POST",
                headers: {
                    'Content-Type': 'Application/json'
                },
                body: JSON.stringify({ username: email, password: password })
            })
            if (!response.ok) {
                throw new Error('something went wrong')
            }
            const data = await response.json()
            console.log(data)
            alert(data.message)
            localStorage.setItem('token', data.token)
        } catch (error) {
            console.log(error)
        }
    }
    return <form onSubmit={onRegister}>
        <div>
            <h1>Register to the website</h1>
            <br />
            <label htmlFor="email">Please Enter the Email</label>
            <input type={"text"} id="email" onChange={e => (setError(), setEmail(e.target.value))} />
            <br />
            <br />
            <label htmlFor="password">Please Enter the password </label>
            <input type="password" onChange={(e) => (setError(''), setpassword(e.target.value))} name="password" id="password" />
            <br />
            <button type="submit">Submit</button>
            <div style={{ color: 'red' }}>{error}</div>
            <br />
            Already a user? <Link to="/login">Login</Link>
        </div>
    </form>
}

export default Register;