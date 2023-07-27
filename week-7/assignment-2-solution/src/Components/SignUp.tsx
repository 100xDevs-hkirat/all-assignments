import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SignUp() {
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
            .post("http://localhost:3000/auth/signup", {
              username: email,
              password: password,
            })
            .then((res) => {
              console.log(res);
              navigate("/login");
            })
            .catch((err) => {
              throw new Error(err);
            });
        }}
      >
        SignUp
      </button>
    </>
  );
}

export default SignUp;
