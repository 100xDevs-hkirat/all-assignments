import { Button, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";


/// File is incomplete. You need to add input boxes to take input for users to login.
function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState('')
    const navigate = useNavigate();

    const loginFetch = async (e) => {
        e.preventDefault()
        await fetch('http://localhost:3000/admin/login', {
            method: 'post',
            headers: {
                username, password
            }
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
            .catch(err => {
                console.log(err)
            })

    }


    return (
        <form >
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <Typography mt={3} variant="h3" component="h3">
                    Login to admin dashboard
                </Typography>
                <TextField id="outlined-basic1" style={{ marginBlock: '10% 5px' }} value={username} label="username" variant="outlined"
                    onChange={e => setUsername(e.target.value)}
                />
                <TextField type='password' id="outlined-basic2" style={{ margin: '5px' }} value={password} label="password" variant="outlined"
                    onChange={e => setPassword(e.target.value)}
                />
                <Button size={'large'} style={{ margin: '5px' }} variant="outlined" onClick={loginFetch}>
                    login
                </Button>


                <Typography >
                    New here? <span style={{ cursor: 'pointer', color: 'blue' }} onClick={() => navigate('/Register')}>Sign up</span>
                </Typography>


            </div>
        </form>
    )
}

export default Login;