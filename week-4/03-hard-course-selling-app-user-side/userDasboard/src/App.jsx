import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Toaster } from "react-hot-toast"
import LandingPage from './components/LandingPage'
import Courses from './components/Courses'
import Course from './components/Course'
import Login from './components/Login'
import Register from './components/Register'
import PurchasedCourse from './components/PurchasedCourse'
import ProtectedRoute from './components/ProtectedRoute'
import Nav from './components/Nav'
import Restricted from './components/Restricted'

function App() {

  return (
    <>
      <Toaster />
      <Router>
        <Nav />
        <Routes>
          <Route
            element={<ProtectedRoute />}
          >
            <Route path='/' element={<LandingPage />} />
            <Route path='/courses' element={<Courses />} />
            <Route path='/courses/:slug' element={<Course />} />
            <Route path='/purchase' element={<PurchasedCourse />} />
          </Route>
          <Route
            element={<Restricted />}
          >
            <Route path='/register' element={<Register />} />
            <Route path='/login' element={<Login />} />
          </Route>
        </Routes>
      </Router>
    </>
  )
}

export default App
