import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { atom, useRecoilState } from "recoil";

import "../index.css";

const emailState = atom({
  key: "emailState",
  default: "",
});

const passwordState = atom({
  key: "passwordState",
  default: "",
});

const messageState = atom({
  key: "messageState",
  default: "",
});

/// File is incomplete. You need to add input boxes to take input for users to register.
function RegisterPage() {
  const [email, setEmail] = useRecoilState(emailState);
  const [password, setPassword] = useRecoilState(passwordState);
  const [message, setMessage] = useRecoilState(messageState);

  const navigate = useNavigate();

  const handleRegister = async () => {
    if (email.trim() === "" || password.trim() == "") {
      setMessage("Email/Password field cannot be empty.");
      return;
    } else {
      try {
        const response = await axios.post(
          "http://localhost:3000/users/signup",
          {
            username: email,
            password: password,
          }
        );

        alert(response.data.message);
        navigate("/login");
      } catch (err) {
        console.log(err);
        setMessage(err.response.data.message);
      }
    }
  };

  return (
    <div className="page">
      <div className="title">
        <Typography
          variant="h4"
          component="div"
          style={{
            flexGrow: 1,
            padding: "10px",
            borderRadius: "4px",
            fontWeight: "bold",
            color: "#101460",
            textAlign: "center",
          }}
        >
          Register A New Account
        </Typography>
        <br />
        {message && (
          <div>
            <p
              style={{
                textAlign: "center",
                color: "#bc1c44",
                fontWeight: "500",
                fontSize: "20px",
              }}
            >
              {message}
            </p>
            <br />
          </div>
        )}
      </div>
      <Card className="form">
        <TextField
          id="email"
          label="Email"
          variant="outlined"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          id="password"
          label="Password"
          variant="outlined"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          style={{ backgroundColor: "#101460" }}
          className="button"
          variant="contained"
          onClick={handleRegister}
        >
          Register
        </Button>
        <br></br>
        <div>
          <h3 style={{ fontWeight: "500" }}>
            Already a user? Click here to login.
          </h3>
          <br />
          <Button
            style={{ backgroundColor: "#101460" }}
            className="button"
            variant="contained"
            onClick={() => navigate("/login")}
          >
            Login
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default RegisterPage;
