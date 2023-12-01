import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ShowCourse from "./pages/ShowCourse";
import PurchasedCourses from "./pages/PurchasedCourses";
import FindCourse from "./pages/FindCourse";
import { CourseData } from "../courseContext";

function App() {
  return (
    <Router>
      <CourseData>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/courses" element={<ShowCourse />} />
          <Route path="/courses/:id" element={<FindCourse />} />
          <Route path="/courses/purchased" element={<PurchasedCourses />} />
        </Routes>
      </CourseData>
    </Router>
  );
}

export default App;
