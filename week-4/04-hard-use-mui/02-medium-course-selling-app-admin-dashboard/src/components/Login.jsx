import { useState } from "react";
import styles from './Login.module.css'
import { Link, useNavigate } from "react-router-dom";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Card, Typography } from "@mui/material";
import AppBar from "./AppBar";


/// File is incomplete. You need to add input boxes to take input for users to login.
function Login() {
    const navigate = useNavigate()
    const [email, setEmail] = useState("");
    const [Password, setPassword] = useState("");
    const [error, setError] = useState("")

    const onLogin = async (e) => {
        e.preventDefault()
        if (email.length === 0 && Password.length === 0) {
            setError('The Input Field should not be empty')
        }
        try {
            const response = await fetch(`http://localhost:3000/admin/login`, {
                method: "POST",
                headers: {
                    'Content-Type': 'Application/json',
                    'username': `${email}`,
                    'password': `${Password}`
                },
                body: JSON.stringify({ username: email, password: Password })
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
            window.location = '/'
            navigate('/courses')

        } catch (error) {
            console.log(error)
        }
    }

    return <>

        <div style={{ paddingTop: 150, marginBottom: 10, display: 'flex', justifyContent: 'center' }}>
            <Typography variant="h6">Welcome to Coursera Sign Up here</Typography>

        </div>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
            <form onSubmit={onLogin}>
                <Card variant="outlined" style={{ width: '400px', padding: '10px' }}>

                    <br />
                    <TextField id="outlined-basic" onChange={(e) => setEmail(e.target.value)} label="Email" variant="outlined" fullWidth={true} />
                    <br />
                    <br />
                    <TextField id="outlined-basic" label="Password" onChange={(e) => setPassword(e.target.value)} type="password" variant="outlined" fullWidth={true} />
                    <br /><br />
                    <Button type="submit" size="large" variant="contained">Sign In</Button>
                    <div className={styles.error}>{error}</div>
                    <br />
                    New user <Link to="/register" className={styles.anchor}>Sign Up</Link>
                </Card>
            </form>
        </div>
    </>
}

export default Login;