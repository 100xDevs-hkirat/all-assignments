import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import styles from './Register.module.css'
import { Button, Card, TextField, Typography } from "@mui/material";
import AppBar from "./AppBar";


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
    return <>

        <div style={{ paddingTop: 150, marginBottom: 10, display: 'flex', justifyContent: 'center' }}>
            <Typography variant="h6">Welcome to Coursera Sign Up here</Typography>

        </div>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
            <form onSubmit={onRegister}>
                <Card variant="outlined" style={{ width: '400px', padding: '10px' }}>

                    <br />
                    <TextField id="outlined-basic" onChange={(e) => setEmail(e.target.value)} label="Email" variant="outlined" fullWidth={true} />
                    <br />
                    <br />
                    <TextField id="outlined-basic" label="Password" onChange={(e) => setpassword(e.target.value)} type="password" variant="outlined" fullWidth={true} />
                    <br /><br />
                    <Button type="submit" size="large" variant="contained">Sign Up</Button>
                    <div className={styles.error}>{error}</div>
                    <br />
                    Already a Customer <Link to="/login" className={styles.anchor}>Login</Link>
                </Card>
            </form>
        </div>
    </>
}

export default Register;