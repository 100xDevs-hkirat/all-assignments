import React from "react";
import { Link } from "react-router-dom";

/// File is incomplete. You need to add input boxes to take input for users to login.
function Login() {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [loggedIn, setLoggedIn] = React.useState("");
    let login=()=>{
        fetch("http://localhost:3000/admin/login",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                email:email,
                password:password
            })
        }).then((response)=>response.json()).then((data)=>{
            if(data.message=="Logged in successfully"){
                localStorage.setItem('token',data.adminToken)
                const token=localStorage.getItem('token')
                setLoggedIn(true)
                console.log(data.message)
            }else{
                console.log(data)
            }
        })
    }
    return <div>
        <h1>Login to admin dashboard</h1>
        <br/><br/>
        Email:<input type={"text"} onChange={e => setEmail(e.target.value)} />
        <br/><br/>
        Password:<input type={"text"} onChange={e => setPassword(e.target.value)} />
        <br/><br/><br/>
        <button onClick={login}>Login</button>
        <br/>
        

        {loggedIn &&(
       <div> 
        <br></br>             
            <b>Login Successful</b>
            <br/><br/>
                <button><Link to="/about">Create-Course</Link></button>
         </div>
            )}
            {!loggedIn && (
               <div>
                New here? 
                <button><Link to="/register">Register</Link></button>
                </div>
              )}
    </div>
}

export default Login;