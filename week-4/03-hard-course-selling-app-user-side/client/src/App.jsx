import { BrowserRouter, Routes, Route , Navigate } from 'react-router-dom';

import Courses from './pages/Courses';
import Homepage from './pages/Homepage';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import CreateCourse from './pages/CreateCourse';

import Header from './components/Header';
import {AuthProvider} from './context/AuthContext';
import { CourseProvider } from './context/CourseContext';
import BuyedCourses from './pages/BuyedCourses';

function App() {

  return (
    <div>
    <AuthProvider>
      <CourseProvider>
      <BrowserRouter>

        <Header/>

          <Routes>
            
            <Route index element={<Homepage/>}/>
            <Route path="courses" element={<Courses/>} />
            <Route path="createcourse" element={<CreateCourse/>} />
            <Route path="login" element={<Login/>}/>
            <Route path="signup" element={<SignUp/>}/>
            <Route path="buyedcourse" element={<BuyedCourses/>}/>
            
          </Routes>
      </BrowserRouter>
      </CourseProvider>
    </AuthProvider>
    </div>
  )
}

export default App
