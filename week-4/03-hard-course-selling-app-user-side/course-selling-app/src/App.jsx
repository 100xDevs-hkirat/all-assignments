import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
// import './App.css'
import Login from './components/Login';
import SignUp from './components/Signup';
import AllCourse from './components/Allcourses';
import Course from './components/Course';
// import Home from './components/Home';
import Coursedetail from './components/CourseDetail';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
function App() {
  const [count, setCount] = useState(0);
  return (
    <>
      <div>
        <Router>
          <Layout/>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/" element={<AllCourse />} />     
            <Route path="/course/:id" element={ <Coursedetail/>} />
            </Routes>
        </Router>
       </div>
    </>
  )
}

export default App
