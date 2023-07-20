import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
// import './App.css'
import Login from './components/Login';
import SignUp from './components/Signup';
import AllCourse from './components/Allcourses';
import Course from './components/Course';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/allcourse" element={<AllCourse />} />
          </Routes>
        </Router>
       </div>
    </>
  )
}

export default App
