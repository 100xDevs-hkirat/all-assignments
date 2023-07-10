import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './components/Login'
import Landing from './components/Landing'
import Register from './components/Register'
import Courses from './components/Courses'
import PurchasedCourses from './components/PurchasedCourses'
import PurchaseCourse from './components/PurchaseCourse'


function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/purchased" element={<PurchasedCourses />} />
        <Route path="/courses/:courseId" element={<PurchaseCourse />} />
        <Route path="*" element={<Landing />} />
      </Routes>
    </Router>
  )
}

export default App
