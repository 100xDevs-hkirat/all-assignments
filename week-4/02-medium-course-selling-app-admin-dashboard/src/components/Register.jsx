import React, { useEffect } from "react";
import { Link } from "react-router-dom";

/// File is incomplete. You need to add input boxes to take input for users to register.
function Register() {
    const [email, setEmail] = React.useState("");
    const [password,setPassword]=React.useState("")
    const [registered,setRegistered]=React.useState(false)
   
    let Email=(e)=>{
      setEmail(e.target.value)
    }
    let Password=(e)=>{
        setPassword(e.target.value)
    }
  let register=()=>{
      fetch("http://localhost:3000/admin/signup",{
        method:"POST",
        headers: {
            "Content-Type": "application/json"
          },
          body:JSON.stringify({
            email:email,
            password:password
          })
      }).then(response=>response.json()).then((data)=>{
        if(data.message=="Admin created successfully"){
            localStorage.setItem('token',data.token)
            localStorage.setItem("registered", "true");
            setRegistered(true)   
        }
       console.log(data)  
      })
    }
    return <div>
        <h1>Register to the website</h1>
        <br/><br/>
        Email:<input type={"text"} placeholder="Enter Email id" onChange={Email} />
        <br/><br/>
        Password:<input type={"text"} placeholder="Enter Password" onChange={Password} />
        <br/><br/>
        <button onClick={register}>Register</button>
        <br/><br/>
       
        <br></br>
        {registered &&(
       <div> 
        <br></br>             
            <b>Registered Successfully</b>
            <br/><br/>
                <button><Link to="/login">Login</Link></button>
         </div>
            )}
            {!registered && (
               <div>
                Already a user? <Link to="/login">Login</Link>
                </div>
              )}
       
    </div>
}

export default Register;