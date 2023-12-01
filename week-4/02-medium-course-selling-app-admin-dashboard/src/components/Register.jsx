import { useState } from "react";

/// File is incomplete. You need to add input boxes to take input for users to register.
function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onHandleRegister = () => {
    const data = {
      email: email,
      password: password,
    };
    fetch("http://localhost:3000/admin/signup", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => console.log(data.token));
  };

  return (
    <div>
      <h1>Register to the website</h1>
      <br />
      <input
        type={"text"}
        placeholder="email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />
      <input
        type="text"
        placeholder="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <br />
      <button onClick={onHandleRegister}>register</button>
      <br />
      Already a user? <a href="/login">Login</a>
    </div>
  );
}

export default Register;
