import React from "react";
import "../CSS/register.css";
import { useNavigate } from "react-router-dom";

/// File is incomplete. You need to add input boxes to take input for users to register.
function Register() {
    const [email, setEmail] = React.useState("");
    const [name, setName] = React.useState("");
    const [error, setError] = React.useState("");

const navigate = useNavigate();
    const handleRegister = async() =>{

       const sendData = await fetch('http://localhost:3000/admin/signup',{

        method : "POST",

        headers : {
            "Content-Type": "application/json",
        },

        body: JSON.stringify({
            name: name,
            email: email,
           
          }),
           });

           const response = await sendData.json();

           if(response.message === 'Admin created successfully'){
            navigate('/login');
           }

           else{
            setError(response.message);
           }

    }

    


    return <div className="register">
    <div className="registerCard">
        <h1 className="registerHeading">Register to the website</h1>
        <br/>

        <lable className = "registerLable">Name  </lable>
        <input className="registerInput" type={"text"} onChange={e => setName(e.target.value)} />

        <lable className = "registerLable">Email  </lable>
        <input className="registerInput" type={"text"} onChange={e => setEmail(e.target.value)} />

        <button onClick = {handleRegister} className="registerButton">Register</button>

        <br/>
        <a  className = "registerRedirect" href="/login"> Already a user? Login</a>
        {error ? alert(error)
    : ""}
    </div>
    </div>
}

export default Register;