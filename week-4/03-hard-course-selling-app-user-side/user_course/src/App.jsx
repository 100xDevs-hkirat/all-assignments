import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css'
import LandingPage from './component/LandingPage'
import Login from './component/Login'
import Register from './component/Register'
import ParticularCouse from './component/ParticularCouse'
import ShowAllCourses from './component/ShowAllCourses'
import PurchasedCourse from './component/PurchasedCourse'

function App() {
 

  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Register />} />
          <Route path='/course/:id' element={<ParticularCouse />} />
          <Route path='/course' element={<ShowAllCourses />} />
          <Route path='/course/purchased' element={<PurchasedCourse />} />
        </Routes>
      </Router>

    </>
  )
}

export default App
