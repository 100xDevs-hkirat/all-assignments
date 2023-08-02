import React from 'react'
import { Typography, Button, Card, TextField, Link } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

/// File is incomplete. You need to add input boxes to take input for users to login.
function Login() {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        marginTop: 15,
        paddingTop: 50,
      }}
    >
      <Card varint={'outlined'} style={{ width: 400, padding: 20 }}>
        <Typography variant="h6">Login to start your journey</Typography>
        <br />
        <TextField
          id="email"
          label="Email"
          variant="outlined"
          fullWidth={true}
          style={{ marginBottom: 10 }}
          onChange={(e) => {
            setEmail(e.target.value)
          }}
        />

        <TextField
          id="password"
          label="Password"
          variant="outlined"
          type={'password'}
          fullWidth={true}
          onChange={(e) => {
            setPassword(e.target.value)
          }}
        />
        <br />
        <br />
        <Button
          variant="contained"
          fullWidth={true}
          onClick={async () => {
            const res = await axios.post(
              'http://localhost:3000/admin/login',
              {
                username: email,
                password: password,
              },
              {
                headers: {
                  'Content-type': 'application/json',
                },
              }
            )
            const data = res.data
            localStorage.setItem('token', data.token)
            window.location = '/'
          }}
        >
          Login
        </Button>
        <br />
        <br />
        <p style={{ textAlign: 'center' }}>
          New here? <Link>Register</Link>
        </p>
      </Card>
    </div>
  )
}

export default Login
