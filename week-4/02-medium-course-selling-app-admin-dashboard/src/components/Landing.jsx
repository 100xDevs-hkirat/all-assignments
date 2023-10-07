// import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/// This is the landing page. You need to add a link to the login page here.
/// Maybe also check from the backend if the user is already logged in and then show them a logout button
/// Logging a user out is as simple as deleting the token from the local storage.
function Landing() {
  const navigate = useNavigate();
  const [user, setUser] = useState("");

  const getUsername = async () => {
    let username = await axios.get("http://localhost:3000/admin/me", {
      headers: { Authorization: "Bearer " + localStorage.getItem("token") },
    });
    setUser(username.data.username);
    return username;
  };

  useEffect(() => {
    getUsername();
  }, []);

  return (
    <div className="flex flex-col h-[100vh] bg-gray-600">
      {/* navbar */}
      <div className="w-full flex justify-between items-center px-3">
        <h1 className="text-blue-500 font-semibold text-[1.5rem]">Coursera</h1>
        {user ? (
          <div className="flex ">
            <h2 className="font-semibold text-[1.5rem] px-4 rounded-md text-orange-400">
              {user}
            </h2>
            <button
              className="bg-blue-400 hover:text-gray-900 rounded-md text-[0.9rem] text-white px-3 py-0 text-semibold"
              onClick={() => {
                window.location = "/";
                localStorage.setItem("token", null);
              }}
            >
              SignOut
            </button>
          </div>
        ) : (
          <div className="flex space-x-3">
            <button
              className="bg-blue-400 hover:text-gray-900 rounded-md text-[0.9rem] text-white px-3 py-0 text-semibold"
              onClick={() => navigate("/register")}
            >
              SignUp
            </button>
            <button
              className="bg-blue-400 hover:text-gray-900 rounded-md text-[0.9rem] text-white px-3 py-0 text-semibold"
              onClick={() => navigate("/login")}
            >
              SignIn
            </button>
          </div>
        )}
      </div>
      <div
        className="flex flex-col justify-center items-center
       mt-40 mx-auto"
      >
        <h1 className="text-[2.6rem] text-white">
          Welcome to course selling website!
        </h1>
        <button
          className="bg-gray-900 hover:text-white text-gray-200 
          px-4 py-1 rounded-md"
          onClick={() => navigate("/courses")}
        >
          View Courses
        </button>
      </div>
    </div>
  );
}

export default Landing;
