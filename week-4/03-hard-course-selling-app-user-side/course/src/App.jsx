import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Landing from './components/Landing';
import Register from './components/Register';
import Login from './components/Login';
import PurchasedCourses from './components/PurchasedCourses';
import ShowCourses from './components/ShowCourses';
import SingleCourse from './components/SingleCourse';

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route exact path="/courses" element={<ShowCourses />} />
          <Route exact path="/courses/:courseId" element={<SingleCourse />} />
          <Route path="/purchasedCourses" element={<PurchasedCourses />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
