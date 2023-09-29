import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

/// File is incomplete. You need to add input boxes to take input for users to register.
function Register() {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [status, setStatus] = React.useState("");
  const navigate = useNavigate();

  const register = async (e) => {
    e.preventDefault();
    console.log("username : ", username);
    console.log("password : ", password);
    try {
      await axios.post("http://localhost:3000/user/signup", {
        username: username,
        password: password,
      });
      setStatus(username + " registered Succesfully !");
      setTimeout(() => { // ! how do i solve this ?
        navigate("/login");
      }, 2000);
    } catch (e) {
      console.log(e);
      setStatus(username + " already registered !");
    }
  };

  useEffect(() => {}, []);

  return (
    <div className="h-[100vh] w-[100vw] flex flex-col justify-center items-center bg-gray-300">
      {/* white container */}
      <h1
        className="absolute top-2 left-2 text-center text-[1.7rem] cursor-pointer font-semibold text-blue-500"
        onClick={() => navigate("/")}
      >
        Coursera
      </h1>
      <div className="mb-5">
        <h2 className="text-center text-[1.4rem] font-semibold text-gray-600">
          Register to the website
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
          value={username}
          className="border border-gray-300 p-2 px-6 rounded-md hover:border-blue-500"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type={"text"}
          value={password}
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
            onClick={(e) => register(e)}
            className="text-white bg-green-600 px-4 py-1 rounded-md"
          >
            Register
          </button>
        </div>

        <br />
        <p className="text-gray-400">
          already registered ?{" "}
          <a
            onClick={() => navigate("/login")}
            className="cursor-pointer hover:text-blue-900 text-blue-600"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
}

export default Register;
