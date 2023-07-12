import React from "react";
import ShowCourses from "./ShowCourses";
import { useNavigate } from "react-router-dom";

/// File is incomplete. You need to add input boxes to take input for users to login.
function Login() {
    const [email, setEmail] = React.useState("");
    const [password,setPassword] = React.useState("");
    const navigate = useNavigate();
    
    const login = ()=>{
        fetch("http://localhost:3000/admin/login",{
            method : "POST",
            headers : {
                'Content-Type' : 'application/json',
                 'username' : email,
                 'password' : password
            }
        }).then((res)=>{
            if(res.ok)
            return res.json();
            else
            throw new Error("Unauthorized");
        }).then((data)=>{
            localStorage.setItem('token','Bearer ' + data.token);
        }).then(()=>{
            navigate("/courses");
        }).catch(error => console.log(error));
    }


    return <div>
        <h1>Login to admin dashboard</h1>
        <br/>
        Email - <input type="text" value={email} onChange={e => setEmail(e.target.value)} />
        <br/>
        Password - <input type="text" value={password} onChange={(e)=>{setPassword(e.target.value)}} />
        <br />
        <button style={{marginTop : "20px"}} onClick={login}>Login</button>
        <br/>
        New here? <a href="/register">Register</a>
    </div>
}

export default Login;