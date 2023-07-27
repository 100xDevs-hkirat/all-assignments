import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import authState from "../store/authState";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [, setAuthState] = useRecoilState(authState);
  const navigate = useNavigate();

  const handleSignup: React.FormEventHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
        setAuthState(data.token);
        navigate("/todo");
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
