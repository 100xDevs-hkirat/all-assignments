import React from "react";
import Card from '@mui/material/Card';
import { TextField } from "@mui/material";
import Button from "@mui/material/Button";
import Appbar from "./Appbar";
/// File is incomplete. You need to add input boxes to take input for users to login.
function Login() {
    const [email, setEmail] = React.useState("");
    const [password,setPassword] = React.useState("");

    return <div>
        <Appbar />
        <div
        style={{paddingTop: 150,
            marginBottom: 10,
            display: "flex", 
            justifyContent: "center"}}>
            <h1>Welcome to Coursera. Login Below</h1>
        </div>
        <div style={{display: "flex", justifyContent: "center"}}>
            <Card varint={"outlined"} style={{width: 400, padding: 20}}>
            <br/>
            <TextField 
                onChange={(even1)=>{
                    let elmt = even1.target
                    setEmail(elmt.value)
                }}
                id="email" label="Email" variant="outlined"  fullWidth={true} />
            <br/>
            <br/>
            <TextField 
                onChange={(even2)=>{
                    let elmt = even2.target
                    setPassword(elmt.value)
                }}
                id="password" label="Password" variant="outlined"  fullWidth={true} />
            <br/>
            <br/>
            <Button
                variant="contained"
                onClick={()=>{
                    fetch("http://localhost:3000/admin/login",{
                        method:"POST",
                        body: JSON.stringify({
                            username:email,
                            password:password
                        }),
                        headers:{
                            "Content-type":"application/json"
                        }
                    }).then((response)=>{
                        response.json().then((data)=>{
                            localStorage.setItem("token", data.token);
                            console.log(localStorage.token)
                        })
                    })
                    }}
                >Submit</Button>
        </Card>
        </div>
    </div>
}

export default Login;