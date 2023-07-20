import React from "react";
import { useFetch } from "../hooks/useFetch";

const DOMAIN = "https://xknrrz-3000.csb.app";

/// File is incomplete. You need to add input boxes to take input for users to register.
function Register() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [message, setMessage] = React.useState("");
  const { data, fetchData } = useFetch();

  const handleSignUp = async (event) => {
    const body = { email, password };
    await fetchData(`${DOMAIN}/admin/signup`, "POST", body);
    setMessage(data?.message);
  };

  return (
    <div>
      <h1>Register to the website</h1>
      <br />
      <label>Email</label>
      <input type={"text"} onChange={(e) => setEmail(e.target.value)} />
      <br />
      <label>Password</label>
      <input type={"text"} onChange={(e) => setPassword(e.target.value)} />
      <br />
      <button onClick={handleSignUp}>Sign Up</button>
      Already a user? <a href="/login">Login</a>
      <br />
      <label>{message}</label>
    </div>
  );
}

export default Register;
