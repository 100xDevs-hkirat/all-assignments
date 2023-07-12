import { useState } from "react";
import { Link } from "react-router-dom";

/// File is incomplete. You need to add input boxes to take input for users to register.
function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState('')
    const onRegister = async (e) => {
        e.preventDefault()
        if (email.length === 0 && password.length === 0) {
            setError('The Input Field should not be empty')
            return
        }
        try {
            const response = await fetch(`http://localhost:3000/admin/signup`, {
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

    return <div style={{
        backgroundColor: '#475569',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
        maxWidth: 500,
        width: '100%',
        margin: "200px auto"
    }}>
        <h1>Register to admin dashboard</h1>
        <br />
        <form onSubmit={onRegister}>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%'
            }}>
                Email - <input type={"text"} onChange={e => setEmail(e.target.value)} />
                Password - <input type={"password"} onChange={e => setPassword(e.target.value)} />
                <br />
                <button type="submit">Register</button>
            </div>
        </form>
        <div style={{ color: 'red' }}>{error}</div>
        <br />
        Already a user? <Link to="/login">Login</Link>
    </div>
}

export default Register;