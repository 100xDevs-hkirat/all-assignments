import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

/// File is incomplete. You need to add input boxes to take input for users to login.
function Login() {
    const navigate = useNavigate()
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState('')

    const onLogin = async (e) => {
        e.preventDefault()
        if (email.length === 0 && password.length === 0) {
            setError('The Input Field should not be empty')
            return
        }
        try {
            const response = await fetch(`http://localhost:3000/admin/login`, {
                method: "POST",
                headers: {
                    'Content-Type': 'Application/json',
                    'username': `${email}`,
                    'password': `${password}`
                },
                body: JSON.stringify({ username: email, password: password })
            })
            if (!response.ok) {
                const errRes = await response.json()
                console.log('err', errRes)
                setError(errRes.message)
                alert(errRes.message)
                throw new Error(errRes.message)
            }
            const data = await response.json()
            console.log(data)
            alert(data.message)
            localStorage.setItem('token', data.token)
            navigate('/courses')

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
        <h1>Login to admin dashboard</h1>
        <br />

        <form onSubmit={onLogin}>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%'
            }}>
                Email - <input type={"text"} onChange={e => setEmail(e.target.value)} />
                Password - <input type={"password"} onChange={e => setPassword(e.target.value)} />
                <br />
                <button type="submit">Login</button>
            </div>
        </form>
        <div style={{ color: 'red' }}>{error}</div>
        <br />
        New here? <Link to="/register">Register</Link>
    </div>
}

export default Login;