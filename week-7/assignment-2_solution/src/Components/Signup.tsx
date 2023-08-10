import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

interface SignupResponse {
  token: string;
}

const Signup = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    const response = await fetch("http://localhost:3000/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data: SignupResponse = await response.json();
    if (data.token) {
      localStorage.setItem("token", data.token);
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
