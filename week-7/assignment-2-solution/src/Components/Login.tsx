import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setpassword] = useState("");
  const navigate = useNavigate();

  return (
    <div className="mt-[20%] p-4 mx-[30%] bg-slate-400 w-1/3 h-1/4 flex flex-col items-center justify-center rounded-lg">
      <h1 className="text-white text-3xl">Login</h1>
      <input
        className="text-sm w-[80%] p-4 border-blue-950 border-2 rounded-xl m-3"
        type="email"
        placeholder="username"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
        }}
      />
      <input
        className="text-sm w-[80%] p-4 border-blue-950 border-2 rounded-xl m-3"
        type="password" // Corrected "texr" to "text"
        placeholder="password"
        value={password}
        onChange={(e) => {
          setpassword(e.target.value);
        }}
      />
      <button
        className="text-sm w-[80%] p-3 bg-slate-200 rounded-2xl"
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
    </div>
  );
}

export default Login;
