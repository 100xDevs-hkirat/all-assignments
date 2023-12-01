import { useState } from "react";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onSignup = () => {
    const credentials = { username, password };
    fetch("http://localhost:3000/users/signup", {
      method: "POST",
      body: JSON.stringify(credentials),
      headers: {
        "Content-Type": "application/header",
      },
    })
      .then((res) => res.json())
      .then((data) => console.log(data));
  };
  return (
    <div>
      <div>
        <h2>Signup Form</h2>
      </div>
      <div>
        <input
          placeholder="Username"
          type="text"
          onChange={(e) => setUsername(e.target.value)}
        />
        <br />
        <br />
        <input
          placeholder="Password"
          type="text"
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <br />
        <button onClick={onSignup}>signup</button>
      </div>
    </div>
  );
};

export default SignUp;
