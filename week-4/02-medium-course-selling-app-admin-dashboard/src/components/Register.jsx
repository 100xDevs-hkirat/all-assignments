import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

/// File is incomplete. You need to add input boxes to take input for users to register.
function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  function handleClick() {
    fetch("http://localhost:3000/admin/signup", {
      method: "POST",
      body: JSON.stringify({
        username: email,
        password: password,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.token) {
          navigate("/");
          localStorage.setItem("token", data.token);
        }
      })
      .catch((err) => {
        console.log("Error: " + err);
      });
  }

  return (
    <div>
      <h1>Register to the website</h1>
      <br />
      <input
        type={"text"}
        placeholder={"Enter email"}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />
      <input
        type={"password"}
        placeholder={"Enter password"}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <button onClick={() => handleClick()}>Register</button>
      <br />
      Already a user? <a href="/login">Login</a>
    </div>
  );
}

export default Register;
