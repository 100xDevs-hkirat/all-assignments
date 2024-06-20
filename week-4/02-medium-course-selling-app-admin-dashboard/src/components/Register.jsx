import axios from "axios";
import React from "react";

/// File is incomplete. You need to add input boxes to take input for users to register.
function Register() {
    const [email, setEmail] = React.useState("");
    const [username,setusername]=React.useState("");
    const [password,setpassword]=React.useState("");    
    function register(){
        const url="http://localhost:3000/admin/signup";
        const data={
            username:username,
            password:password,
            email:email,
        }       
        axios.post(url,data).then((response)=>{
            
                console.log(response.data);
                const bearerToken = response.headers.authorization;
                console.log('Bearer Token:', bearerToken);
            
        }).catch((err)=>{
            console.log("Error : "+err);
        })
    }
    return <div>
        <h1>Register to the website</h1>
        <br/>
        Email - <input type={"email"} value ={email} onChange={e => setEmail(e.target.value)} />
        <br/>
        UserName -<input type={"text"} value={username} onChange={e=>setusername(e.target.value)}/>
        <br/>
        Password-<input type={"password"} value={password} onChange={e=>setpassword(e.target.value)}/>
        <br/>
        <button onClick={register}>Register</button>
        <br/>
        Already a user? <a href="/login" >Login</a>
    </div>
}

export default Register;