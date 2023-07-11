import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { SnackbarContext } from "./SnackbarContext.jsx";
import SnackbarAlert from "./SnackbarAlert.jsx";

import Button from "@mui/material/Button";

function Register() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
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
    <div>
      <h1>Register Page</h1>
      <br />
      <form onSubmit={register}>
        Email -{" "}
        <input type="email" onChange={(e) => setEmail(e.target.value)} />
        <br />
        Password -{" "}
        <input type="password" onChange={(e) => setPassword(e.target.value)} />
        <br />
        <Button type="submit" variant="contained">
          Register
        </Button>
      </form>

      <SnackbarAlert />
    </div>
  );
}

export default Register;
