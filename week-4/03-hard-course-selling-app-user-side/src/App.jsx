import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Landing from './components/Landing';
import Register from './components/Register';
import ShowCourses from './components/ShowCourses';
import PurchasedCourses from './components/PurchasedCourses';
import BuyCourse from './components/BuyCourse';

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Landing />}
        />
        <Route
          path="/login"
          element={<Login />}
        />
        <Route
          path="/register"
          element={<Register />}
        />
        <Route
          path="/courses"
          element={<ShowCourses />}
        />
        <Route
          path="/courses/purchased"
          element={<PurchasedCourses />}
        />
        <Route
          path="/courses/:courseId"
          element={<BuyCourse />}
        />
      </Routes>
    </Router>
  );
}

export default App;
