import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Landing from "./components/Landing";
import CreateCourse from './components/CreateCourse';
import Register from './components/Register';
import ShowCourses from './components/ShowCourses';
import ParticularCourse from './components/ParticularCourse';
import AppBar from './components/AppBar';

// This file shows how you can do routing in React.
// Try going to /login, /register, /about, /courses on the website and see how the html changes
// based on the route.
// You can also try going to /random and see what happens (a route that doesnt exist)
function App() {

    return (<>
        <Router>
            <AppBar/>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route element={<PrivateRoutes />}>
                    <Route path="/createCourse" element={<CreateCourse />} />
                    <Route path="/courses" element={<ShowCourses />} />
                    <Route path='/courses/:id' element={<ParticularCourse />} />
                </Route>
            </Routes>
        </Router>
    </>

    );
}
const PrivateRoutes = () => {
    const isLogedIn = localStorage.getItem('token') !== null ? true : false
    return (isLogedIn ? <Outlet /> : <Navigate to='/login' />);
};


export default App;