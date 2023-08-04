import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Landing from "./components/Landing";
import CreateCourse from "./components/CreateCourse";
import Register from "./components/Register";
import ShowCourses from "./components/ShowCourses";
import AppBar from "./components/AppBar";
import "./App.css";
import CourseList from "./components/Courses/CourseList";
import AddCourse from "./components/Courses/AddCourse";
import UpdateCourse from "./components/Courses/UpdateCourse";
import ResponsiveAppBar from "./components/Courses/ResponsiveAppBar";
import CourseViewer from "./components/Courses/CourseViewer";

// This file shows how you can do routing in React.
// Try going to /login, /register, /about, /courses on the website and see how the html changes
// based on the route.
// You can also try going to /random and see what happens (a route that doesnt exist)
function App() {
  return (
    <div className="main">
      <AppBar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<CreateCourse />} />
        <Route path="/courses" element={<CourseList />} />
        <Route path="/addcourse" element={<AddCourse />} />
        <Route path="/course/:courseId" element={<UpdateCourse />} />
        <Route path="/courses/:courseId" element={<CourseViewer />} />
      </Routes>
    </div>
  );
}

export default App;
