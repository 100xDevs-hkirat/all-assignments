import { Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

/// File is incomplete. You need to add input boxes to take input for users to register.
function Register() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState('')

    const loginFetch = async (e) => {
        e.preventDefault()
        await fetch('http://localhost:3000/admin/signup', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        }).then(res => res.json())
            .then(res => {
                if (res.token) {
                    localStorage.setItem('token', res.token)
                    navigate('/')
                } else {
                    setPassword('')
                    setUsername('')
                }
            })

    }


    return (
        <form >
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <Typography mt={3} variant="h3" component="h3">
                    Register to the website
                </Typography>
                <TextField id="outlined-basic1" style={{ marginBlock: '10% 5px' }} value={username} label="username" variant="outlined"
                    onChange={e => setUsername(e.target.value)}
                />
                <TextField type='password' id="outlined-basic2" style={{ margin: '5px' }} value={password} label="password" variant="outlined"
                    onChange={e => setPassword(e.target.value)}
                />
                <Button size={'large'} style={{ margin: '5px' }} variant="outlined" onClick={loginFetch}>
                    Sign up</Button>

                <Typography>
                    Already a user? <span style={{ cursor: 'pointer', color: 'blue' }} onClick={() => navigate('/login')} >login</span>
                </Typography>

            </div>
        </form>
    )

}

export default Register;