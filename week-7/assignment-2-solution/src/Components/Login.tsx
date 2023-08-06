import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserToken } from "../types";
import { useSetRecoilState } from "recoil";
import { authState } from "../store/authState";
import { ENV } from "../env";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const setAuth = useSetRecoilState(authState);

  const handleLogin = async () => {
    const response = await fetch(`${ENV.VITE_BASE_URL}/auth/login`, {
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
