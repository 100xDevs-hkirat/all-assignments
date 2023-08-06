import React from 'react'
import axios from "axios"

function Signup() {
    const [username, setUsername] = React.useState("")
    const [password, setPassword] = React.useState("")

    const handleSubmit = (e)=>{
        e.preventDefault();
        const body = {
            username,
            password
        }
        axios.post("http://localhost:3000/users/signup", body)
        .then((res)=>{
            console.log(res);
            localStorage.setItem('auth', JSON.stringify(res.data.token));
        })
    }

  return (
    <div>
        <h2>username</h2>
        <input type="text" onChange={(e)=>setUsername(e.target.value)} />
        <h2>password</h2>
        <input type="text" onChange={(e)=>setPassword(e.target.value)} />
        <button onClick={handleSubmit}>login</button>
    </div>
  )
}

export default Signup