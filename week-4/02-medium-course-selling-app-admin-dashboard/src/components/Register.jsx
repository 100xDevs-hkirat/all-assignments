import React, { useState } from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Avatar from "@mui/material/Avatar";

import axios from "axios";
import { Link } from "react-router-dom";
import "./Register.css";

/// File is incomplete. You need to add input boxes to take input for users to register.
function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [error, setError] = useState(false);
  const [isValid, setIsValid] = useState(true);

  const emailHandler = event => {
    setEmail(event.target.value);
  };
  const passwordHandler = event => {
    setPassword(event.target.value);
  };
  const firstNameHanlder = event => {
    setFirstName(event.target.value);
  };

  const submitHandler = () => {
    if (
      firstName.trim().length === 0 ||
      password.trim().length === 0 ||
      email.trim().length === 0
    ) {
      setIsValid(true);
      return;
    }

    const signup = {
      firstName,
      username: email,
      password,
    };

    setEmail("");
    setFirstName("");
    setPassword("");

    console.log(signup);

    const post = async () => {
      try {
        const response = await axios.post(
          "http://127.0.0.1:3000/admin/signup",
          {
            ...signup,
          },

          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        localStorage.setItem("token", response.data.token);
        console.log(response.data);
        setError(false);
      } catch (error) {
        console.log(error);
        setError(true);
      }
    };

    post();
  };

  return (
    <div className="signup-page">
      <Card variant="outlined" className="signup-form">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            marginBottom: "10px",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography className="signup-title" component="h1" variant="h5">
            Sign up
          </Typography>
        </div>

        {error && (
          <Alert severity="error">
            Admin already exists — <strong>check it out!</strong>
          </Alert>
        )}
        <div className="input">
          <TextField
            sx={{
              width: 190,
            }}
            id="outlined-basic"
            label="First Name*"
            variant="outlined"
            value={firstName}
            onChange={firstNameHanlder}
          />
          <TextField
            sx={{
              width: 190,
            }}
            className="last-name"
            id="outlined-basic"
            label="Last Name*"
            variant="outlined"
            value={firstName}
            onChange={firstNameHanlder}
          />
        </div>

        <div className="input">
          <TextField
            fullWidth={true}
            id="outlined-basic"
            label="Email"
            variant="outlined"
            type={"email"}
            value={email}
            onChange={emailHandler}
          />
        </div>
        <div className="input">
          <TextField
            fullWidth={true}
            id="outlined-basic"
            label="Password"
            variant="outlined"
            type={"password"}
            value={password}
            onChange={passwordHandler}
          />
        </div>
        <div className="btn-container">
          <Button
            variant="contained"
            className="btn"
            fullWidth={true}
            onClick={submitHandler}
          >
            Sign up
          </Button>
        </div>

        <div className="bottom">
          <p>Already a user? </p> <Link to="/login">Login</Link>
        </div>
      </Card>
    </div>
  );
}

export default Register;
