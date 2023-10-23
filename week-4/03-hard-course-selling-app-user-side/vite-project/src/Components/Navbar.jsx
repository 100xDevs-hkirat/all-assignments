import React from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/navbar.css";
export default function Navbar() {
  const navigate = useNavigate();

  const handleLogOut = () => {
    localStorage.removeItem("userToken");
    navigate("/");
  };
  return (
    <div>
      <div className="navbar">
        <div onClick={() => navigate("/")} className="navLogo">
          Courses.com
        </div>

        <div className="navItems">
          {localStorage.getItem("userToken") ? (
            <>
              <div onClick={() => navigate("/")} className="navItem">
              Home
              </div>

              <div onClick={() => navigate("/mycourses")} className="navItem">
                My Courses
              </div>

              <div onClick={handleLogOut} className="navItem">
                Logout
              </div>
            </>
          ) : (
            <>
              <div onClick={() => navigate("/register")} className="navItem">
                Register
              </div>
              <div onClick={() => navigate("/login")} className="navItem">
                Login
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
