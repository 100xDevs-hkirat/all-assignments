import { useState } from "react";


/// File is incomplete. You need to add input boxes to take input for users to login.
function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("")

    const onLogin = async (e) => {
        e.preventDefault()
        if (email.length === 0 && password.length === 0) {
            setError('The Input Field should not be empty')
        }
        try {
            const response = await fetch(`http://localhost:3000/users/login`, {
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
        } catch (error) {
            console.log(error)
        }
    }

    return <div>
        <h1>Login to admin dashboard</h1>

        <form onSubmit={onLogin}>
            <label htmlFor="email">Email</label>
            <input type={"text"} id="email" value={email} onChange={e => setEmail(e.target.value)} />
            <br />
            <label htmlFor="password">Password</label>
            <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} id="password" />
            <button>Login</button>
        </form>
        <div className="error">{error}</div>
        New here? <a href="/register">Register</a>
    </div>
}

export default Login;