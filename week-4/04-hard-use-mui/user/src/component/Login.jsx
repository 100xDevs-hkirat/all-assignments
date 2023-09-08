import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {Typography,Card,TextField,Button} from '@mui/material'
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
            navigate('/course')

        } catch (error) {
            console.log(error)
        }
    }

    return  <div style={{
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
    }}>
        <Typography variant="h6">Login to admin dashboard</Typography>

        <br />
        <Card variant="outlined" style={{ padding: 30 }}>
            <form onSubmit={onLogin}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'flex-start'
                }}>
                    <TextField variant="outlined" label="Email" type={"text"} onChange={e => setEmail(e.target.value)} />
                    <br />
                    <TextField label="Password" variant="outlined" type={"password"} onChange={e => setPassword(e.target.value)} />
                    <br />
                    <Button variant="contained" type="submit">Login</Button>
                </div>
            </form>
            <Typography variant="p" style={{ color: 'red' }}>{error}</Typography>
            <br />
            New here? <Link to="/signup">Register</Link>
        </Card>
    </div>
}

export default Login;