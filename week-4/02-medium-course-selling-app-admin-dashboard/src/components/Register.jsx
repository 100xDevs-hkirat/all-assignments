import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";

import "./style.css";

/// File is incomplete. You need to add input boxes to take input for users to register.
function Register() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleRegister = () => {
    if (email.trim() === "" || password.trim() == "") {
      setMessage("Email/Password field cannot be empty.");
      return;
    } else {
      fetch("http://localhost:3000/admin/signup", {
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
          setEmail("");
          setPassword("");
          if (data.message !== "Admin created successfully") {
            setMessage(data.message);
            return;
          }
          alert(data.message);
          navigate("/login");
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  return (
    <div className="page">
      <div className="title">
        <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
          Register to the website
        </Typography>
        <p style={{ textAlign: "center", color: "red" }}>{message}</p>
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
        <Button className="button" variant="contained" onClick={handleRegister}>
          Register
        </Button>
        <br></br>
        <div>
          <h3 style={{ fontWeight: "500" }}>
            Already a user? Click here to login.
          </h3>
          <Button
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

export default Register;
