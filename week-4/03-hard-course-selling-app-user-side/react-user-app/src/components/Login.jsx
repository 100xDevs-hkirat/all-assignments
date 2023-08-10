import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

/// File is incomplete. You need to add input boxes to take input for users to login.
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  function handleClick() {
    axios("http://localhost:3000/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        username: email,
        password: password,
      },
    })
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
        if (data.token) {
          localStorage.setItem("token", data.token);
        }
        // redirect to landing page
        navigate("/");
      })
      .catch((err) => console.log(err));
  }

  return (
    <div>
      <h1>Login to User Profile</h1>
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
      <button onClick={() => handleClick()}>Login</button>
      <br />
      <br />
      New here? <Link to="/signup">SignUp</Link>
    </div>
  );
}

export default Login;
