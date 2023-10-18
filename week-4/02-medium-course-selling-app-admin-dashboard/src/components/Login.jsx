import React from "react";
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { redirect } from "react-router-dom";

/// File is incomplete. You need to add input boxes to take input for users to login.
function Login() {
    const [username, setUserName] = React.useState("");
    const [pass, setPassword] = React.useState("");


    
    const adminLogin = () => {
        try {
            fetch("http://localhost:3000/admin/login", {
                method:"POST",
                headers:{
                    "Content-type": "application/json",
                    "username": username,
                    "pass":pass
                }
            }).then((res) => {
                console.log("here");
                return res.json();
            }).then((data)=>{
                console.log(data);
                localStorage.setItem("logintoken", data.jwtToken);
            })
        }
        catch(e) 
        {
            console.log("Exception while Logging in ")
        }
    }

    return <>
        <div style={{display:"flex", alignItems:"center", justifyContent:"center", height:"87vh"}}>
            <Card style={{padding:"40px"}}>
            <div>
            <h1>Login to admin dashboard</h1>
            <div style={{display:"flex", flexDirection:"column"}}>
            <TextField style={{margin:"7px"}} id="standard-basic" label="UserName" variant="standard" onChange={e => setUserName(e.target.value)}/>
            <TextField style={{margin:"7px"}} id="standard-basic" label="Password" variant="standard" type={"password"} onChange={e => setPassword(e.target.value)}/>
            <Button style={{marginTop:"20px"}} variant="outlined" onClick={adminLogin}>Signup</Button>
            <div style={{marginTop:"15px"}}>
                New here? <a style={{marginLeft:"30px"}} href="/register">Register</a>
            </div>
            </div>
            </div>
            </Card>
        </div>
    </>
}

export default Login;