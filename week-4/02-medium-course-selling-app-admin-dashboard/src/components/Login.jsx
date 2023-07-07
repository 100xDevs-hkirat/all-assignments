import { useState } from "react";

/// File is incomplete. You need to add input boxes to take input for users to login.
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const storeToken = (token) => {
    const existingToken = localStorage.getItem("token");
    if (existingToken) {
      localStorage.removeItem("token");
      localStorage.setItem("token", token);
    }
    localStorage.setItem("token", token);
  };

  const onHandleSignin = () => {
    const data = {
      email: email,
      password: password,
    };
    const headers = new Headers();
    headers.append("Credentials", JSON.stringify(data));
    fetch("http://localhost:3000/admin/login", {
      method: "POST",
      body: JSON.stringify(data),
      headers: data,
    })
      .then((res) => res.json())
      .then((data) => storeToken(data.token));
  };

  return (
    <div>
      <h1>Login to admin dashboard</h1>
      <br />
      Email -{" "}
      <input
        type={"text"}
        placeholder="email"
        onChange={(e) => setEmail(e.target.value)}
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
      <button onClick={onHandleSignin}>login</button>
      <br />
      New here? <a href="/register">Register</a>
    </div>
  );
}

export default Login;
