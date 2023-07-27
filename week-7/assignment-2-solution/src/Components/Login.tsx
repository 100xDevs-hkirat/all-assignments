import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setpassword] = useState("");
  const navigate = useNavigate();

  return (
    <>
      <input
        type="email"
        placeholder="username"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
        }}
      />
      <input
        type="password" // Corrected "texr" to "text"
        placeholder="password"
        value={password}
        onChange={(e) => {
          setpassword(e.target.value);
        }}
      />
      <button
        onClick={() => {
          axios
            .post("http://localhost:3000/auth/login", {
              username: email,
              password: password,
            })
            .then((res) => {
              if (res.data) {
                if (res.data.message === "Logged in successfully") {
                  localStorage.setItem("token", "Bearer " + res.data.token);
                  navigate("/todos");
                }
              }
            })
            .catch((err) => {
              // throw new Error(err);
              console.log(err);
            });
        }}
      >
        Login
      </button>
    </>
  );
}

export default Login;
