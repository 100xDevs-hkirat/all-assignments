import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import { Button, TextField, Typography } from '@mui/material'
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async () => {


    try {
      const response = await axios({
        url: 'http://localhost:3000/users/login',
        method: 'POST',
        headers: { username, password },
      });

      const res = response.data;

      if (res.token) {
        localStorage.setItem('token', res.token);
        navigate('/');
      } else {
        setPassword('');
        setUsername('');
      }
    } catch (error) {
      console.log(error);
    }
  }


  return (
    <div className='center full__page' style={{ backgroundColor: "#B9CCED" }}>

      <div className="center" style={{ width: '25%', flexDirection: 'column', gap: '1rem', backgroundColor: "#F6E5F5", padding: "1rem", borderRadius: "10px" }}>

        <Typography variant="h5" component="h5">
          Login
        </Typography>

        <TextField style={{ width: '100%', }} value={username} label="Username*" variant="outlined" onChange={e => setUsername(e.target.value)} />
        <TextField style={{ width: '100%', }} value={password} label="Password*" variant="outlined" onChange={e => setPassword(e.target.value)} />

        <Button size='large' style={{ width: '100%', backgroundColor: "#B9CCED" }} variant="contained"
          onClick={handleLogin}
        >Login</Button>

        <Typography variant="body2" >
          New user? <span style={{ color: '#22D1EE', cursor: 'pointer' }} onClick={() => navigate('/register')}>Register</span>
        </Typography>
      </div>


    </div>

  )
}

export default Login