import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { SnackbarContext } from "./SnackbarContext.jsx";
import SnackbarAlert from "./SnackbarAlert.jsx";

import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

function Login() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const { showSnackbar } = React.useContext(SnackbarContext);
  const navigate = useNavigate();

  function login(event) {
    event.preventDefault();
    axios
      .post(
        "http://localhost:3000/users/login",
        {},
        {
          headers: {
            "Content-Type": "application/json",
            username: email,
            password,
          },
        }
      )
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        showSnackbar(res.data.message, "success")
        navigate("/");
      })
      .catch((err) => {
        showSnackbar(err.response.data.message || err.toString(), "error");
        console.error(err);
      });
  }

  return (
    <Container
      maxWidth="xs"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        minHeight: "100vh",
      }}
    >
      <Box sx={{ mt: "10vh", mb: 4 }}>

        <Typography variant="h2" component="h1" align="center">
          Login
        </Typography>

      </Box>
      <form onSubmit={login} style={{ width: "100%" }}>
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Login
        </Button>
        
      </form>

      <SnackbarAlert />
    </Container>
  );
}

export default Login;
