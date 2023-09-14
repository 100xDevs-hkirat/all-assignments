import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Landing from "./component/Landing";
import Login from "./component/Login";
import Register from "./component/Register";
import ShowCourses from "./component/ShowCourses";
import PurchaseCourse from "./component/PurchaseCourse";
import PurchasedCourses from "./component/PurchasedCourses";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/courses" element={<ShowCourses/>} />
        <Route path="/courses/:courseId" element={<PurchaseCourse/>} />
        <Route path="/courses/purchased" element={<PurchasedCourses/>} />
      </Routes>
    </Router>
  );
}

export default App;
