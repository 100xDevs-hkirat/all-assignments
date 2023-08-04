import React from "react";
import { useNavigate } from "react-router-dom";

const adminSignupURL = "http://localhost:3000/admin/signup";

function Register() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const navigate = useNavigate();

  const handleSignup = () => {
    fetch(adminSignupURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: email,
        password: password,
      }),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        return Promise.reject(res);
      })
      .then((data) => {
        let token = data.token;
        let message = data.message;

        alert(`${message}`);

        if (token != undefined) {
          localStorage.setItem("token", token);
          navigate("/about");
        }
      })
      .catch((err) => {
        console.log("Error: " + err);
      });
  };

  return (
    <div>
      <h1>Register to the website</h1>
      <br />
      Email <input type={"text"} onChange={(e) => setEmail(e.target.value)} />
      <br />
      Password{" "}
      <input type={"text"} onChange={(e) => setPassword(e.target.value)} />
      <br />
      <br />
      <button onClick={handleSignup}>SignUp</button>
      <br />
      <br />
      Already a user? <a href="/login">Login</a>
    </div>
  );
}

export default Register;
