import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './components/Login'
import CreateCourse from './components/CreateCourse'
import Register from './components/Register'
import ShowCourses from './components/ShowCourses'
import Appbar from './components/Appbar'
import './App.css'
import Home from './components/Home'
import Sidebar from './components/Sidebar'
import Footer from './components/Footer'
import EditCourse from './components/EditCourse'
import { RecoilRoot } from 'recoil'

// This file shows how you can do routing in React.
// Try going to /login, /register, /about, /courses on the website and see how the html changes
// based on the route.
// You can also try going to /random and see what happens (a route that doesnt exist)
function App() {
  return (
    <div style={{ backgroundColor: 'white' }}>
      <RecoilRoot>
        <Router>
          <Appbar />
          <div style={{ display: 'flex' }}>
            <Sidebar />
            <div style={{ flex: '1' }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/createcourse" element={<CreateCourse />} />
                <Route path="/courses" element={<ShowCourses />} />
                <Route path="/course/:courseId" element={<EditCourse />} />
              </Routes>
              <Footer />
            </div>
          </div>
        </Router>
      </RecoilRoot>
    </div>
  )
}

export default App
