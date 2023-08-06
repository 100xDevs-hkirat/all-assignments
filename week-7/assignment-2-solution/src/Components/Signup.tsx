import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserToken } from "../types";
import { useSetRecoilState } from "recoil";
import { authState } from "../store/authState";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const setAuth = useSetRecoilState(authState);
  const navigate = useNavigate();

  const handleSignup = async () => {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data: UserToken = await response.json();
    if (data.token) {
      localStorage.setItem("token", data.token);
      setAuth({ username, token: data.token });
      navigate("/todos");
    } else {
      alert("Error while signing up");
    }
  };

  return (
    <div style={{ justifyContent: "center", display: "flex", width: "100%" }}>
      <div>
        <h2>Signup</h2>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        Already signed up? <Link to="/login">Login</Link>
        <button onClick={handleSignup}>Signup</button>
      </div>
    </div>
  );
};

export default Signup;
