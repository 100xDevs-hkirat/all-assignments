import { Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import Login from "./components/Login";
import PurchasedCourses from "./components/PurchasedCourses";
import BuyCourse from "./components/BuyCourse";
import SignUp from "./components/SignUp";
import Courses from "./components/Courses";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/purchased" element={<PurchasedCourses />} />
        <Route path="/courses/:courseId" element={<BuyCourse />} />
        <Route path="*" element={"404: Error Not Found"} />
      </Routes>
    </>
  );
}

export default App;
