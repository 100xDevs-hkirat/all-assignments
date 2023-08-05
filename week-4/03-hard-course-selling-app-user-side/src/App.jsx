import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Landing from "./components/Landing";
import Register from './components/Register';
import DisplayCourse from './components/DisplayCourses';
import BuyCourse from './components/BuyCourse';
import PurchasedCourses from './components/PurchasedCourses';

// This file shows how you can do routing in React.
// Try going to /login, /register, /about, /courses on the website and see how the html changes
// based on the route.
// You can also try going to /random and see what happens (a route that doesnt exist)
function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/courses" element={<DisplayCourse />} />
                <Route path="/courses/:id" element={<BuyCourse />} />
                <Route path='/purchasedCourses' element={<PurchasedCourses />}/>
            </Routes>
        </Router>
    );
}

export default App;