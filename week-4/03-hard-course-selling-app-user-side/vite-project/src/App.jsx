import { useState } from "react";
import Typography from "@mui/material/Typography";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./screens/Home";
import CourseDescription from "./screens/CourseDescription";
import Login from "./screens/Login";
import Register from "./screens/Register";
import PurchasedCourses from "./screens/PurchasedCourses";
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses/:id" element={<CourseDescription />} />
          <Route path="/courses/purchased" element={<PurchasedCourses />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
