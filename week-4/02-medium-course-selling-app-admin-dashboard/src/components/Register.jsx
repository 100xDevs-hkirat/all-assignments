import React from "react";
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axios from 'axios';

/// File is incomplete. You need to add input boxes to take input for users to register.
function Register() {
    const [username, setUserName] = React.useState("");
    const [pass, setPassword] = React.useState("");


    const adminSignup = () => {
        fetch('http://localhost:3000/admin/signup', {
            method:"POST",
            body: JSON.stringify({
                username,
                pass
            }),
            headers: {
                "Content-type": "application/json"
            }
        }).then((res)=>{
            return res.json()
        }).then((data) => {
            console.log(data);
            localStorage.setItem("signuptoken", data.jwtToken)
        })
        console.log("Signup Successfully.");
    }

    return <>
        <div style={{display:"flex", alignItems:"center", justifyContent:"center", height:"87vh"}}>
            <Card style={{padding:"33px"}}>
            <div>
            <h1>Register to the admin website</h1>
            
            <div style={{display:"flex", flexDirection:"column"}}>
                <TextField style={{margin:"7px"}} id="standard-basic" label="UserName" variant="standard" onChange={(e) => { setUserName(e.target.value)}}/>
                <TextField style={{margin:"7px"}} id="standard-basic" label="Password" variant="standard" type={"password"} onChange={e => setPassword(e.target.value)}/>
                <Button style={{marginTop:"20px"}} variant="outlined" onClick={adminSignup}>Signup</Button>
                <div style={{marginTop:"15px"}}>
                    Already a user?  
                    <a style={{marginLeft:"30px"}} href="/login">Login</a>   
                </div>
            </div> 
            </div>
            </Card>
        </div>
    </>
}

export default Register;