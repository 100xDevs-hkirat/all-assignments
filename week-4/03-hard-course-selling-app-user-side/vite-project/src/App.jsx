import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


import './App.css'
import Login from './Components/Login';
import Landing from './Components/Landing';
import Register from './Components/Register';
import Navbar from './Components/Navbar';
import Course from './Components/Course';
import MyCourses from './Components/MyCourses';

function App() {

  return (
    <>
    <Router>
      <Navbar/>

      <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/mycourses" element={<MyCourses/>} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/course/:id" element={<Course />} />


      </Routes>

    </Router>
    
    </>
  )
}

export default App
