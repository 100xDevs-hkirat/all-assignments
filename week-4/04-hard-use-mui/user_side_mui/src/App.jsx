import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Landing from './pages/Landing';
import Register from './pages/Register';
import ShowCourses from './pages/ShowCourses';
import PurchasedCourses from './pages/PurchasedCourses';
import BuyCourse from './pages/BuyCourse';
import TokenContext from './helpers/TokenContext';

function useLocalStorage(key) {
  const [value, setValue] = useState(localStorage.getItem(key));
  function setLocalStorage(newValue) {
    setValue(newValue);
    if (newValue === null) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, newValue);
    }
  }
  return [value, setLocalStorage];
}

export default function App() {
  const [jwtToken, setJwtToken] = useLocalStorage('jwt_token');

  return (
    <TokenContext.Provider value={{ jwtToken, setJwtToken }}>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route
              index
              element={<Landing />}
            />
            <Route
              path="/login"
              element={<Login />}
            />
            <Route
              path="/register"
              element={<Register />}
            />
            <Route
              path="/courses"
              element={<ShowCourses />}
            />
            <Route
              path="/courses/purchased"
              element={<PurchasedCourses />}
            />
            <Route
              path="/courses/:courseId"
              element={<BuyCourse />}
            />
          </Route>
        </Routes>
      </Router>
    </TokenContext.Provider>
  );
}
