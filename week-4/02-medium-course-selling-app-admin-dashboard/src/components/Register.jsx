import React from 'react'
import { Typography, Button, Card, TextField, Link } from '@mui/material'
import axios from 'axios'

/// File is incomplete. You need to add input boxes to take input for users to register.
function Register() {
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
        <Typography variant="h6">Sign up and start learning</Typography>
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
          fullWidth={true}
          type="password"
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
            const res = await axios.post('http://localhost:3000/admin/signup', {
              username: email,
              password: password,
            })
            localStorage.setItem('token', res.data.token)
            window.location = '/'
            // fetch('http://localhost:3000/admin/signup', {
            //   method: 'POST',
            //   body: JSON.stringify({
            //     username: email,
            //     password: password,
            //   }),
            //   headers: {
            //     'Content-type': 'application/json',
            //   },
            // }).then((res) => {
            //   res.json().then((data) => {
            //     localStorage.setItem("token",data.token)
            //   })
            // })
          }}
        >
          Sign up
        </Button>
        <br />
        <br />
        <p style={{ textAlign: 'center' }}>
          Already have an account?<Link>Login</Link>
        </p>
      </Card>
    </div>
  )
}

export default Register
