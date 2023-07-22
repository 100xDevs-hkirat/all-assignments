import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Landing from "./components/Landing";
import Register from "./components/Register";
import Courses from "./components/Courses";
import PurchasedCourses from "./components/PurchasedCourses";
import PurchaseCourse from "./components/PurchaseCourse";
import { SnackbarProvider } from "./components/SnackbarContext";
import Appbar from "./components/Appbar";
import PrivateRoute from "./components/PrivateRoute";
import React from "react";

import LoginContext from "./components/LoginContext";
// const TokenContext = React.createContext();

function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(
    localStorage.getItem("token") ? true : false
  );
  return (
    <Router>
      <div
        id="app"
        style={{
          display: "grid",
          gridTemplate: "64px minmax(100vh, auto) / 1fr",
          alignItems: "start",
          backgroundColor: "#eee",
          gridAutoRows: "1fr",
          gridAutoFlow: "column",
          border: "4px  solid green",
          padding: "0px",
          margin: "0px",
        }}
      >
        <LoginContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
          <SnackbarProvider>
            <Appbar />

            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/courses"
                element={<PrivateRoute Component={Courses} />}
              />
              <Route
                path="/courses/purchased"
                element={<PrivateRoute Component={PurchasedCourses} />}
              />
              <Route
                path="/courses/:courseId"
                element={<PrivateRoute Component={PurchaseCourse} />}
              />
              <Route path="*" element={<Landing />} />
              {/* <Route render={() => <Redirect to="/" />} /> */}
            </Routes>
            {/* </div> */}
          </SnackbarProvider>
        </LoginContext.Provider>
      </div>
    </Router>
  );
}

export default App;
