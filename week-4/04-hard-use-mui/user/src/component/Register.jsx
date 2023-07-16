import { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Card, TextField, Typography } from "@mui/material";


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

    return <div style={{
        // backgroundColor: '#475569',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',

    }}>
        <Typography variant="h6">Register to User dashboard</Typography>
        <br />
        <Card variant="outlined" style={{ padding: 20 }}>
            <form onSubmit={onRegister}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    justifyContent:'center',
                    alignItems:'flex-start'
                }}>
                    <TextField type={"text"} label="Email" onChange={e => setEmail(e.target.value)} />
                    <br />
                    <TextField label="Password" type={"password"} onChange={e => setPassword(e.target.value)} />
                    <br />
                    <Button variant="contained" type="submit">Register</Button>
                </div>
            </form>
            <Typography variant="p" style={{ color: 'red' }}>{error}</Typography>
            <br />
            Already a user? <Link to="/login">Login</Link>
        </Card>
    </div>
}

export default Register;