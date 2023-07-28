import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import "../index.css";
import { atom, useRecoilState } from "recoil";

/// File is incomplete. You need to add input boxes to take input for users to login.

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

const isLoggedInState = atom({
  key: "isLoggedInState",
  default: false,
});

function LoginPage() {
  const [email, setEmail] = useRecoilState(emailState);
  const [password, setPassword] = useRecoilState(passwordState);
  const [message, setMessage] = useRecoilState(messageState);
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(isLoggedInState);

  const navigate = useNavigate();

  const handleLogin = () => {
    if (email.trim() === "" || password.trim() == "") {
      setMessage("Email/Password field cannot be empty.");
      return;
    } else {
      fetch("http://localhost:3000/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: email,
          password: password,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          localStorage.setItem("token", data.token);
          if (data.message === "Invalid username or password") {
            setMessage(data.message);
            return;
          }
          setEmail("");
          setPassword("");
          setIsLoggedIn(true);
          navigate("/courses");
          window.location.reload();
        });
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
          Login To LearnAcademy
        </Typography>
        <br />

        {message && (
          <div>
            <p className="message">{message}</p>
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
          onClick={handleLogin}
        >
          Login
        </Button>
        <br></br>
        <div>
          <h3 style={{ fontWeight: "500" }}>
            New here? Click here to register new account.
          </h3>
          <br />
          <Button
            style={{ backgroundColor: "#101460" }}
            className="button"
            variant="contained"
            onClick={() => navigate("/register")}
          >
            Register
          </Button>
        </div>
      </Card>
    </div>
  );
}
export { isLoggedInState };

export default LoginPage;
