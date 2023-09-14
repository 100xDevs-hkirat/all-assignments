import React from "react";
import { useState } from "react";
import { Card, Grid, Link } from "@mui/material";
import Input from "./UI/InputField";
import Button from './UI/FullWidthButton'

// / File is incomplete. You need to add input boxes to take input for users to login.
function Login() {
  return (
    <Grid container direction="column" justifyContent="center" alignItems="center">
      <h1>Login to admin dashboard</h1>
      <LoginComponent/>
      <div>
        <span>New here?</span>
        <Link href="/register" sx={{fontWeight:'bold', marginX:.5}}>Register</Link>
      </div>
    </Grid>
  );
}

function LoginComponent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onLogin = () => {
    fetch("http://localhost:3000/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        username: email,
        password: password,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.token) {
          const token = "Bearer "+data.token;
          localStorage.setItem("adminToken", token);
          setEmail("");
          setPassword("");
          window.location.href = window.location.origin+'/courses';
        } else {
          alert(data.message);
        }
      })
      .catch((err) => console.log(err));
  };

  const onChangeEmail = (event) => {
    setEmail(event.target.value);
  };

  const onChangePassword = (event) => {
    setPassword(event.target.value);
  };
  return (
    <Card sx={{ width: "100%", maxWidth: 345, padding: 3, marginY:1}}>
      <Input value={email} onChange={onChangeEmail} placeholder="Email" />
      <Input value={password} onChange={onChangePassword} placeholder="Password"/>
      <Button onClick = {onLogin}>Login</Button>
    </Card>
  );
}


export default Login;
