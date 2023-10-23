import React from "react";
import '../CSS/login.css'
import { useNavigate } from "react-router-dom";

/// File is incomplete. You need to add input boxes to take input for users to login.
function Login() {

    const navigate = useNavigate()
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    const [error, setError] = React.useState("");



    const handleLogin = async() =>{

        const sendData = await fetch('http://localhost:3000/users/login',{
            method : 'POST',
            headers:{
                'Content-type' : 'application/json',
                email : email,
                password : password
            },

            body : JSON.stringify({
                email : email,
                password : password
            })
        })

        const response = await sendData.json();

        if(response.message === 'Logged in successfully'){
            localStorage.setItem('userToken', response.token);


            navigate('/')
        }
        
        else{
            setError(response.message);
        }
    }

    return <div className="login">
        <div className="loginCard">
        <h1 className="loginHeading">Welcome Back!</h1>
        <br/>
        <lable className = "loginLable">Email  </lable><input className = "loginInput"type={"text"} onChange={e => setEmail(e.target.value)} />
        <br/>
        <lable className = "loginLable">Password  </lable><input className = "loginInput"type={"text"} onChange={e => setPassword(e.target.value)} />
        <br/>

        <button onClick={handleLogin} className="loginButton">Login</button>
        <br/>
    <a className="loginRedirect" href="/register">New Here? Register</a>

    {error ? alert(error)
    : ""}
    </div>
    </div>
}

export default Login;