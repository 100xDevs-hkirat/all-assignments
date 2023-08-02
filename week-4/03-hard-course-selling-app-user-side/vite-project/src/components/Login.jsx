import React from 'react'
import axios from 'axios'

function Login() {
  const [username, setUsername] = React.useState("")
    const [password, setPassword] = React.useState("")

    const handleSubmit = (e)=>{
        e.preventDefault();
        const user = {
            "username":username,
            "password":password
        }
        axios.post("http://localhost:3000/users/login", {}, {
          headers:user
        }).then((res)=>{
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

export default Login