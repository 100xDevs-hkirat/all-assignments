import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { SnackbarContext } from "./SnackbarContext.jsx";
import SnackbarAlert from "./SnackbarAlert.jsx";

import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

function Register() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const { showSnackbar } =
    React.useContext(SnackbarContext);
  const navigate = useNavigate();

  function register(event) {
    event.preventDefault();
    axios
      .post("http://localhost:3000/users/signup", {
        headers: {
          "Content-Type": "application/json",
        },
        username: email,
        password,
        firstName,
        lastName
      })
      .then((res) => {
        if (res.data.token) {
          localStorage.setItem("token", res.data.token);
          showSnackbar(res.data.message, "success");
          navigate("/");
        }
      })
      .catch((err) => {
        showSnackbar(err.response.data.message, "error");
        console.error(err)
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
      <Box sx={{ mt: "5vh", mb: 4 }}>
        <Typography variant="h2" component="h1" align="center">
          Register
        </Typography>
      </Box>
      <form onSubmit={register} style={{ width: "100%" }}>
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
        <TextField
          label="First Name"
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Last Name"
          type="Text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
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
          Register
        </Button>
      </form>
      <SnackbarAlert />
    </Container>
  );
}

export default Register;
