import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signin from "./Signin.jsx";
import Signup from "./Signup.jsx";
import Appbar from "./Appbar.jsx";
import AddCourse from "./AddCourse.jsx";
import Courses from "./Courses";
import Course from "./Course";
import {
    RecoilRoot,
    atom,
    selector,
    useRecoilState,
    useRecoilValue,
  } from 'recoil';

function App() {

    return (
        <div style={{width: "100%",
            height: "100vh",
            backgroundColor: "#eeeeee"}}
        >
            <RecoilRoot>
                <Router>
                    <Appbar />
                    <Routes>
                    <Route path={"/addcourse"} element={<AddCourse />} />
                    <Route path={"/course/:courseId"} element={<Course />} />
                    <Route path={"/courses"} element={<Courses />} />
                    <Route path={"/signin"} element={<Signin />} />
                    <Route path={"/signup"} element={<Signup />} />
                    </Routes>
                </Router>
            </RecoilRoot>
        </div>
    );
}

export default App;