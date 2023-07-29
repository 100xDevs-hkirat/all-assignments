import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = () => {
    fetch("http://localhost:3000/users/signup", {
      method: "POST",
      body: JSON.stringify({ username: email, password }),
      headers: {
        "Content-Type": "application/json", // Set the Content-Type to JSON
      },
    })
      .then((res) => {
        if (res.status === 201) {
          setIsSuccess(true);
          setTimeout(() => {
            navigate("/");
          }, 3000);
        }
        return res.json();
      })
      .then((data) => localStorage.setItem("token", data.token));
  };

  return (
    <>
      <Card sx={{ minWidth: 275 }}>
        <CardContent>
          <Typography
            sx={{ fontSize: 18, fontWeight: "bold" }}
            color="text.secondary"
            gutterBottom
            onClick={() => {
              navigate("/");
            }}
          >
            Courserraaa
          </Typography>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              //   justifyContent: "center",
            }}
          >
            <TextField
              id="email"
              label="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              sx={{ margin: 3, maxWidth: "60vw" }}
            />
            <TextField
              id="password"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              sx={{ margin: 3, maxWidth: "60vw" }}
            />
          </div>
        </CardContent>
        <CardActions sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            size="small"
            variant="outlined"
            onClick={() => handleSubmit()}
          >
            Register
          </Button>
        </CardActions>
        <CardActions sx={{ display: "flex", justifyContent: "flex-start" }}>
          <Button
            size="small"
            onClick={() => {
              navigate("/login");
            }}
          >
            Already Registered Yet? Login Here
          </Button>
        </CardActions>
      </Card>
      <Snackbar
        open={isSuccess}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }} // Set the position to top-right
      >
        <Alert elevation={6} variant="filled" severity="success">
          Registration Successful!!!
        </Alert>
      </Snackbar>
    </>
  );
};

export default Register;
