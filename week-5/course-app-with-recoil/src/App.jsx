import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { RecoilRoot } from "recoil";

import Signin from "./Signin";
import Signup from "./Signup";
import Appbar from "./Appbar";
import AddCourse from "./AddCourse";
import Courses from "./Courses";
import Course from "./Course";

function App() {
  return (
    <div
      style={{ width: "100vw", height: "100vh", backgroundColor: "#eeeeee" }}
    >
      <RecoilRoot>
        <Router>
          <Appbar />
          <Routes>
            <Route path="/addcourse" element={<AddCourse />} />
            <Route path="/course/:courseId" element={<Course />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </Router>
      </RecoilRoot>
    </div>
  );
}

export default App;
