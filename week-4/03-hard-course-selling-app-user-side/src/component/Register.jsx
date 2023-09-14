import React from "react";
import { useState } from "react";
import { Card, Grid, Link } from "@mui/material";
import Input from './UI/InputField';
import Button from './UI/FullWidthButton'

/// File is incomplete. You need to add input boxes to take input for users to register.
function Register() {
  return (
    <Grid container direction='column' justifyContent='center' alignItems='center' sx={{marginY: 10}}>
      <RegisterComponent/>
      <div>
        <span>Already a user?</span>
        <Link href="/login" sx={{fontWeight:'bold', marginX:.5}}>Login</Link>
      </div>
    </Grid>
  );
}

function RegisterComponent() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = useState("");

  const onRegister = () => {
    fetch("http://localhost:3000/users/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: email, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.token) {
          const token = "Bearer "+data.token;
          localStorage.setItem("userToken", token);
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
    <Card sx= {{width: '100%', maxWidth: 345, padding: 3, marginY: 1}}>
      <Input value={email} onChange={onChangeEmail} placeholder="Email" />
      <Input value={password} onChange={onChangePassword} placeholder="Password"/>
      <Button onClick = {onRegister}>Register</Button>
    </Card>
  )
}

export default Register;
