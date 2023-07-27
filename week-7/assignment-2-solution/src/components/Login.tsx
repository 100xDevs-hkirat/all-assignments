import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import authState from "../store/authState";
import "./login.css";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [auth, setAuth] = useRecoilState(authState);
  const navigate = useNavigate();

  const handleLogin: React.FormEventHandler = async (e) => {
      try {
        e.preventDefault();
        const res = await fetch("http://localhost:3000/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });
        const data = await res.json();
        if (data.token) {
            console.log("login", data.token)
          localStorage.setItem("token", data.token);
          setAuth({...auth, token: data.token});
          navigate("/todos");
        } else {
          alert("Invalid credentials");
        }
    } catch(e) {
        alert(e);
    }
  };
  return (
    <div className="card">
      <h1>Login</h1>
      <form
        onSubmit={handleLogin}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <input
          className="loginInput"
          type="email"
          name="username"
          value={username}
          placeholder="Email"
          required
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="loginInput"
          type="password"
          name="password"
          value={password}
          placeholder="Password"
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
      <Link
        to="/signup"
        style={{
          justifySelf: "flex-end",
          color: "white",
          fontSize: "small",
          marginTop: "10px",
        }}
      >
        Create an account
      </Link>
    </div>
  );
};

export default Login;
