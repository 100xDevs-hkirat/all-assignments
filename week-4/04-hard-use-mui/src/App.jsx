import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from './components/SignUp'
import AppBar from './components/AppBar';
import SignIn from './components/SignIn';
import CreateCourse from './components/CreateCourse';
import Courses from './components/Courses';
import Course from './components/Course';
import { RecoilRoot } from 'recoil';

function App() {

  return (
    <>
    <RecoilRoot>
      <Router>
      <AppBar />
        <Routes>
          <Route path="/" element={<SignUp />}></Route>
          <Route path="/signup" element={<SignUp />}></Route>
          <Route path="/signin" element={<SignIn />}></Route>
          <Route path="/createCourse" element={<CreateCourse/>}></Route>
          <Route path="/courses" element={<Courses/>}></Route>
          <Route path="/course/:id" element={<Course/>}></Route>
        </Routes>
      </Router>
      </RecoilRoot>
    </>
    
  )
}

export default App
