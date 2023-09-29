import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {

    const [user, setUser] = useState('');    
  const navigate = useNavigate();

  const getUsername = async () => {
    let res = await axios.get("http://localhost:3000/user/me", {
      headers: { Authorization: "Bearer " + localStorage.getItem("token") },
    });
    // console.log('user name : ', username)
    setUser(res.data.username);
    return res.data.username;
    };
    
    useEffect(() => {
        getUsername();
    }, [])

  return (
    <div className="w-full flex justify-between items-center">
      <h1
        className="text-center text-[1.7rem] cursor-pointer font-semibold text-blue-500"
        onClick={() => navigate("/")}
      >
        Coursera
      </h1>
      {localStorage.getItem("token") == "undefined" && (
        <button
          className="bg-blue-400 text-white px-6 py-1 rounded-md"
          onClick={() => navigate("/login")}
        >
          Login
        </button>
      )}
      {user && (
        <h2 className="bg-gray-200 font-semibold text-[1.3rem] px-4 rounded-md text-gray-900">
          {user}
        </h2>
      )}
    </div>
  );
};

export default Navbar;
