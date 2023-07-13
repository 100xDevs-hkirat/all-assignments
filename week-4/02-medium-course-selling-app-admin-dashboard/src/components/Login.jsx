import React from "react";
import { useNavigate } from "react-router-dom";

const adminLoginURL = "http://localhost:3000/admin/login";

function Login() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    fetch(adminLoginURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: email,
        password: password,
      }),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        return Promise.reject(res);
      })
      .then((data) => {
        let token = data.token;
        let message = data.message;

        alert(`${message}`);
        if (token != undefined) {
          localStorage.setItem("token", token);
          navigate("/about");
        }
      })
      .catch((err) => {
        console.log("Error: " + err);
      });
  };

  return (
    <div>
      <h1>Login to admin dashboard</h1>
      <br />
      Email <input type={"text"} onChange={(e) => setEmail(e.target.value)} />
      <br />
      Password{" "}
      <input type={"text"} onChange={(e) => setPassword(e.target.value)} />
      <br />
      <br />
      <button onClick={handleLogin}>Login</button>
      <br />
      <br />
      New here? <a href="/register">Register</a>
    </div>
  );
}

export default Login;
