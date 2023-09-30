import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import Courses from './components/Courses'
import Landing from './components/Landing'
import Login from './components/Login'
import Nav from './components/Nav'
import PurchaseCourse from './components/PurchaseCourse'
import Register from './components/Register'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Nav></Nav>
      <Router>
        <Routes>
          <Route path="/" element={<Landing/>}/>
          <Route path="/courses" element={<Courses/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/purchase" element={<PurchaseCourse/>}/>
          <Route path="/register" element={<Register/>}/>
        </Routes>
      </Router>
    </>
  )
}

export default App
