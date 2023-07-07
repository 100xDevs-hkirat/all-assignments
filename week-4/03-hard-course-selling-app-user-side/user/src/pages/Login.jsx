import { useState } from "react";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const storeToken = (token) => {
    const exists = localStorage.getItem("token");
    if (exists) {
      localStorage.removeItem("token");
      localStorage.setItem("token", token);
    }
    localStorage.setItem("token", token);
  };
  const handleLogin = () => {
    const credentials = { username, password };
    const headers = new Headers();
    headers.append("data", JSON.stringify(credentials));
    fetch("http://localhost:3000/users/login", {
      method: "POST",
      headers: headers,
    })
      .then((res) => res.json())
      .then((data) => storeToken(data.token));
  };
  return (
    <div>
      <div>
        <h2>Login Page</h2>
      </div>
      <div>
        <input
          type="text"
          placeholder="username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <br />
        <br />
        <input
          type="text"
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <br />
        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
};

export default Login;
