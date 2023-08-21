import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './components/Login'
import CreateCourse from './components/CreateCourse'
import Register from './components/Register'
import ShowCourses from './components/ShowCourses'
import './App.css'
import Layout from './components/common/Layout'
import Landing from './components/Landing'
import NotFound from './components/common/NotFound'
import ProtectedRoutes from './components/common/ProtectedRoutes'
import PublicRoutes from './components/common/PublicRoutes'
import CourseDetail from './components/CourseDetail'
import PurchasedCourses from './components/PurchasedCourses'

// This file shows how you can do routing in React.
// Try going to /login, /register, /about, /courses on the website and see how the html changes
// based on the route.
// You can also try going to /random and see what happens (a route that doesnt exist)
function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route element={<PublicRoutes />}>
            <Route path='/' element={<Landing />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/admin/login' element={<Login isAdmin />} />
            <Route path='/admin/register' element={<Register isAdmin />} />
          </Route>
          <Route element={<ProtectedRoutes />}>
            <Route path='/about' element={<CreateCourse />} />
            <Route path='/admin/dashboard' element={<ShowCourses />} />
            <Route path='/admin/course/:id' element={<CourseDetail />} />
            <Route path='/user/dashboard' element={<ShowCourses />} />
            <Route path='/user/dashboard' element={<ShowCourses />} />
            <Route path='/user/course/:id' element={<CourseDetail />} />
            <Route path='/user/purchased' element={<PurchasedCourses />} />
          </Route>
          <Route path='*' element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
