import React from "react";
import axios from "axios";

/// File is incomplete. You need to add input boxes to take input for users to login.
function Login() {
    const [email, setEmail] = React.useState("");
    const [password, setpassword]=React.useState("");
    
    function login(){
        const url="http://localhost:3000/admin/login";
        const data={
            email:email,
            password:password,
        }        
        axios.post(url,data).then((response)=>{
            console.log(response.data);
            console.log(response.header.bearerToken);
            const bearerToken = response.headers.authorization;
            console.log('Bearer Token:', bearerToken);
        
        }).catch((err)=>{
            console.log("Error : "+err);
        })
    }

    return <div>
        <h1>Login to admin dashboard</h1>
        <br/>
        Email - <input type={"text"} value ={email} onChange={e => setEmail(e.target.value)} />
        <br/>
        <br/>
        Password-<input type="password" value={password} onChange={e=>setpassword(e.target.value)}/>
        <br/>
        <button onClick={login}>Login</button>
        <br/>
        New here? <a href="/register">Register</a>
    </div>
}

export default Login;