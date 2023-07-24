import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Landing from './components/Landing';
import Register from './components/Register';
import ShowCourses from './components/ShowCourses';

import ProtectedRoute from './components/ProtectedRoute';
import CourseDetail from './components/CourseDetail';
import NotFound from './components/NotFound';
import PurchasedCourses from './components/PurchasedCourses';

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
            path='/my-courses'
            element={
              <ProtectedRoute>
                <PurchasedCourses />
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
          <Route path='*' element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
