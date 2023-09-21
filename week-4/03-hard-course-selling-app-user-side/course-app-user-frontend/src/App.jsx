import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Landing from "./components/Landing";
import Register from './components/Register';
import AppBar from './components/AppBar';
import Courses from './components/Courses';
import Purchases from './components/Purchases';
import PurchaseCourse from './components/PurchaseCourse'
import { RecoilRoot, useSetRecoilState } from 'recoil';
import { userState } from './components/stores/atoms/user';
import { purchasedCoursesState } from './components/stores/atoms/purchasedCourses'
import { useEffect } from 'react';
import { BASE_URL } from './config.js';
import axios from 'axios';


function App() {
  return (
    <RecoilRoot>
      <Router>
        <AppBar></AppBar>
        <InitUser></InitUser>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/purchases" element={<Purchases />} />
          <Route path="/course/:courseId" element={<PurchaseCourse />} />
        </Routes>
      </Router>
    </RecoilRoot>
  );
}

function InitUser() {
  const setUser = useSetRecoilState(userState);
  const setCourseState = useSetRecoilState(purchasedCoursesState)
  // console.log("hiii");
  const init = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/users/me`, {
        headers: {
          "Authorization": localStorage.getItem("token")
        }
      });
      if (response.data.username) {
        // console.log(response.data);
        setUser({
          isLoading: false,
          user: response.data.username
        });
      } else {
        setUser({
          isLoading: false,
          user: null
        });
      }
    } catch (e) {
      console.log(e);
      setUser({
        isLoading: false,
        user: null
      });
    }
  };

  const populatePurchases = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/users/purchasedCourses`, {
        headers: {
          "Authorization": localStorage.getItem("token")
        }
      });
      if (response.data.purchasedCourses) {
        setCourseState(response.data.purchasedCourses);
      } else {
        setCourseState(null);
      }
    } catch (e) {
      setCourseState(null);
    }
  }

  useEffect(() => {
    init();
    populatePurchases();
  }, []);

  return <></>
}

export default App
