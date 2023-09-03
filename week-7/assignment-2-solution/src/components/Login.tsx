import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import axios from "axios";
import authState from "../store/authState";
import "./login.css";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const setAuth = useSetRecoilState(authState);
  const navigate = useNavigate();

  const handleLogin: React.FormEventHandler = async (e) => {
      try {
        e.preventDefault();
        // const res = await fetch("http://192.168.152.215:6000/auth/login", {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify({ username, password }),
        // });
        const res = await axios.post("/auth/login", {
          username,
          password, 
        });

        // const data = await res.json();
        const data = res.data;
        if (data.token) {
          localStorage.setItem("token", data.token);
          setAuth({username: null, token: data.token});
          navigate("/");
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
          autoComplete="username"
          required
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="loginInput"
          type="password"
          name="password"
          value={password}
          placeholder="Password"
          autoComplete="current-password"
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
