import { useState } from "react";
import { Link } from "react-router-dom";

interface LoginResponse {
  token: string;
}

const Login = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = async () => {
    const response = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data: LoginResponse = await response.json();
    if (data.token) {
      localStorage.setItem("token", data.token);
      window.location.assign("/todos");
    } else {
      alert("invalid credentials");
    }
  };

  return (
    <div style={{ justifyContent: "center", display: "flex", width: "100%" }}>
      <div>
        <h2>Login</h2>
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
        New here? <Link to="/signup">Signup</Link>
        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
};

export default Login;
