import React from "react";
import { Link } from "react-router-dom";
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Navbar from "./Navbar";
import Typography from '@mui/material/Typography'
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import { useSetRecoilState } from "recoil";
import { flashState } from "../store/atoms/flash";

/// File is incomplete. You need to add input boxes to take input for users to register.
function Register() {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const navigate = useNavigate();
    const setSnackbar = useSetRecoilState(flashState);

    const registerCall = async () =>{
        try {
        const { data } = await axios.post('http://localhost:3000/admin/signup', {
             username : email,
             password: password
         })

        console.log(data)
        localStorage.setItem('token', data.token)
        setSnackbar({
            open: true,
            message: "Account Created Successfully",
            severity: "success",
        })
        navigate("/courses");
        } catch (error) {
            setSnackbar({
                open: true,
                message: "Something Went Wrong",
                severity: "error",
            })
            console.log(error)
        }
        
    }


    return <div>
        <Navbar />
        <div style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "10vh",
                color: "white"
            }}>
            <h1>Register to the website</h1>
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
                <Button style={{}} onClick={registerCall} variant="contained">Sign Up</Button>
                <br />
                <br />
                <Typography variant="h6" color="initial">
                  Already a user? <Link to="/login">Login</Link>
                </Typography> 
            </Card>
        </div>
    </div>
}

export default Register;