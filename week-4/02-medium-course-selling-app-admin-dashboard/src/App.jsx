import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Landing from "./components/Landing";
import CreateCourse from './components/CreateCourse';
import Register from './components/Register';
import ShowCourses from './components/ShowCourses';
import NoMatch from './components/NoMatch';
import ProtectedRoute from './components/ProtectedRoute';
import { useRecoilState, useRecoilValue, useRecoilValueLoadable } from 'recoil';
import { coursesList, loading, user } from './recoil/atom';
import RestrictedRoute from './components/RestrictedRoute';
import { Toaster } from 'react-hot-toast';
import Nav from './components/Nav';
import { useEffect } from 'react';
import CoursePage from './components/CoursePage';
// This file shows how you can do routing in React.
// Try going to /login, /register, /about, /courses on the website and see how the html changes
// based on the route.
// You can also try going to /random and see what happens (a route that doesnt exist)
function App() {
    const client = useRecoilValue(user);
    
    return (<>
        <Toaster /> 
        <Router>
            <Nav />
            <Routes>
                <Route
                    element={<RestrictedRoute />}
                >
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Route>
                <Route
                    element={<ProtectedRoute />}
                >
                    <Route path="/" element={<Landing />} />
                    <Route path="/courses" element={<ShowCourses />} />
                    <Route path="/about" element={<CreateCourse />} />
                    <Route path='/courses/:slug' element={<CoursePage />} />
                </Route>
                <Route path="*" element={<NoMatch />} />
            </Routes>
        </Router>
    </>
    );
}

export default App;