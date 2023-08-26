import React from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import { useSetRecoilState } from "recoil";
import { flashState } from "../store/atoms/flash";

/// File is incomplete. You need to add input boxes to take input for users to login.
function Login() {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const navigate = useNavigate();
    const setSnackbar = useSetRecoilState(flashState);

    const loginCall = async () =>{
        try {
            const { data } = await axios.post('http://localhost:3000/admin/login', {
        }, {
            headers: {
                'username': email,
                'password': password
            }
        })

        console.log(data)
        localStorage.setItem('token', data.token)
        setSnackbar({
            open: true,
            message: "Logged in Successfully",
            severity: "success",
        })
        navigate("/courses");
            
        } catch (error) {
            setSnackbar({
                open: true,
                message: "InValid Username/Password",
                severity: "error",
            })
            console.log(error)
        }
        
    }

    return <div>
        <Navbar/>
        <div style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "10vh",
                color: "white"
            }}>
            <h1>Login to admin dashboard</h1>
        </div>
        <div style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "1vh",
            }}>
            <Card variant="outlined" sx={{ width: 1/4 , minWidth:250}} style={{padding: "20px", backgroundColor:"#f7f9fa"}}>
                <TextField
                    variant="outlined"
                    required
                    label="Email"
                    type="email"
                    placeholder="Enter Email"
                    sx={{ width: 1 }}
                    onChange={(e)=> {
                        setEmail(e.target.value)
                    }}
                />
                <br />
                <br />
                <TextField
                    variant="outlined"
                    required
                    label="Password"
                    type="password"
                    placeholder="Enter Password"
                    sx={{ width: 1 }}
                    onChange={(e)=> {
                        setPassword(e.target.value)
                    }}
                />
                <br />
                <br />
                <Button style={{}} onClick={loginCall} variant="contained">Login</Button>
                <br />
                <br />
                <Typography variant="h6" color="initial">
                   New here? <Link to="/register">Register</Link>
                </Typography>
                
            </Card>
        </div>
    </div>
}

export default Login;