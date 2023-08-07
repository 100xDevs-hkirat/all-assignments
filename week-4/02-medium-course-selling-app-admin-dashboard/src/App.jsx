import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Landing from "./components/Landing";
import CreateCourse from './components/CreateCourse';
import Register from './components/Register';
import ShowCourses from './components/ShowCourses';
import NoMatch from './components/NoMatch';
import ProtectedRoute from './components/ProtectedRoute';
import { useRecoilState, useRecoilValue } from 'recoil';
import { loading, user } from './recoil/atom';
import RestrictedRoute from './components/RestrictedRoute';
import { Toaster } from 'react-hot-toast';
import LoadingBar from 'react-loading-bar';
// This file shows how you can do routing in React.
// Try going to /login, /register, /about, /courses on the website and see how the html changes
// based on the route.
// You can also try going to /random and see what happens (a route that doesnt exist)
function App() {
    const client = useRecoilValue(user);
    return (<>
        <Toaster />    
        <Router>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route
                    element={<RestrictedRoute />}
                >
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Route>
                <Route path="/about" element={<CreateCourse />} />
                <Route
                    element={<ProtectedRoute />}
                >
                    <Route path="/courses" element={<ShowCourses />} />
                </Route>
                <Route path="*" element={<NoMatch />} />
            </Routes>
        </Router>
    </>
    );
}

export default App;