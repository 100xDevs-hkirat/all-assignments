import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";

/// File is incomplete. You need to add input boxes to take input for users to login.
function Login() {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [status, setStatus] = React.useState("");

  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    try {
      await axios
        .post("http://localhost:3000/user/login", {
          username,
          password,
        })
        .then((e) => {
          const authToken = e.data.token;
          setStatus(e.data.message);
          localStorage.setItem("token", authToken);
          setTimeout(() => {
            navigate("/courses");
          }, 3000);
        });
    } catch (e) {
      console.log(e);
      setStatus("Please Register before logging in !");
    }
  };

  console.log("satatus : ", status);
  return (
    <div className="h-[100vh] w-[100vw] flex flex-col justify-center items-center bg-gray-300">
      <h1
        className="absolute top-2 left-2 text-center text-[1.7rem] cursor-pointer font-semibold text-blue-500"
        onClick={() => navigate("/")}
      >
        Coursera
      </h1>
      {/* white container */}
      <div className="mb-10">
        <h1 className="text-center text-xl">Welcome back!</h1>
        <h2 className="text-center text-[1rem] text-gray-400">
          Login to admin dashboard
        </h2>
      </div>
      <div className="flex flex-col space-y-3 p-10 rounded-md shadow-xd bg-white text-black">
        {status && (
          <p className="text-red-600 font-semibold text-[0.9rem] text-center">
            {status}
          </p>
        )}
        <input
          type={"text"}
          placeholder="Username"
          className="border border-gray-300 p-2 px-6 rounded-md hover:border-blue-500"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type={"text"}
          className="border border-gray-300 p-2 px-6 rounded-md hover:border-blue-500"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="flex space-x-1">
          <input type="checkbox" />
          <p>Remember me </p>
        </div>
        <div>
          <button
            onClick={(e) => login(e)}
            className="text-white bg-green-600 px-4 py-1 rounded-md"
          >
            Login
          </button>
        </div>
        <br />
        <p className="text-gray-400">
          New here?{" "}
          <a
            onClick={() => navigate("/register")}
            className="cursor-pointer text-blue-600"
          >
            Register
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;
