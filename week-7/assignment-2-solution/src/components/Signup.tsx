import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import authState from "../store/authState";
import axios from "axios";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const setAuth = useSetRecoilState(authState);
  const navigate = useNavigate();

  const handleSignup: React.FormEventHandler = async (e) => {
    e.preventDefault();
    try {
      // const res = await fetch("http://192.168.152.215:6000/auth/signup", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ username, password }),
      // });
      const res = await axios.post("/auth/signup", {
        username,
        password,
      });

      // const data = await res.json();
      const data = res.data;
      if (data.token) {
        localStorage.setItem("token", data.token);
        setAuth({username: null, token:data.token});
        navigate("/");
      } else {
        alert("Error while signing up");
      }
    } catch (e) {
      alert(e);
    }
  };
  return (
    <div className="card">
      <h1>Signup</h1>
      <form
        onSubmit={handleSignup}
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
        <button type="submit">Signup</button>
      </form>
      <Link
        to="/login"
        style={{
          justifySelf: "flex-end",
          color: "white",
          fontSize: "small",
          marginTop: "10px",
        }}
      >
        Have an account
      </Link>
    </div>
  );
};

export default Signup;
