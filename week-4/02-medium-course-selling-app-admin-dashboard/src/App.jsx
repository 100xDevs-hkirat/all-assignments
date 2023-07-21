import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Landing from './components/Landing';
import CreateCourse from './components/CreateCourse';
import Register from './components/Register';
import ShowCourses from './components/ShowCourses';

import ProtectedRoute from './components/ProtectedRoute';
import CourseDetail from './components/CourseDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Landing />}>
          <Route
            index
            element={
              <ProtectedRoute>
                <ShowCourses />
              </ProtectedRoute>
            }
          />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route
            path='/create'
            element={
              <ProtectedRoute>
                <CreateCourse />
              </ProtectedRoute>
            }
          />
          <Route
            path='/courses'
            element={
              <ProtectedRoute>
                <ShowCourses />
              </ProtectedRoute>
            }
          />
          <Route
            path='/courses/:courseId'
            element={
              <ProtectedRoute>
                <CourseDetail />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
