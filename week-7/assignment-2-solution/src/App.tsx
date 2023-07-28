import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "./App.css";
import Todos from "./components/Todos";
import Login from "./components/Login";
import Signup from "./components/Signup";
import authState from "./store/authState";
import { IUser } from "./store/interface";

axios.defaults.baseURL = "http://192.168.152.215:5000";
axios.defaults.headers.post["Content-Type"] = "application/json";

axios.interceptors.request.use(
  (request) => {
    return request;
  },
  (error) => {
    console.log(error);
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log(error);
    return Promise.reject(error);
  }
);

const App: React.FC = () => {
  const [auth, ] = useRecoilState(authState);
  const isAuthenticated = () => auth && auth.token && auth.username;
  return (
    <Router>
      <InitState />
      <Routes>
        <Route
          path="/"
          element={isAuthenticated() ? <Todos /> : <Navigate to="login" />}
        />
        <Route
          path="/todos"
          element={isAuthenticated() ? <Todos /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={
            <div className="center">
              {" "}
              <Login />{" "}
            </div>
          }
        />
        <Route
          path="/signup"
          element={
            <div className="center">
              {" "}
              <Signup />{" "}
            </div>
          }
        />
      </Routes>
    </Router>
  );
};

const InitState: React.FC = () => {
  const [auth, setAuth] = useRecoilState(authState);
  const navigate = useNavigate();

  const init = async () => {
    if (!auth.token) {
      navigate("/login");
      return;
    }
    if (auth && auth.token && auth.username) {
      return;
    }
    try {
      axios.defaults.headers.common["Authorization"] = `Bearer ${auth.token}`;
      const response = await axios.get("/auth/me");
      if (response.status === 200) {
        const data: IUser = response.data;

        setAuth({ ...auth, username: data.username });
        navigate("/todos");
      } else {
        navigate("/login");
      }
    } catch (e) {
      navigate("/login");
    }
  };
  React.useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth, setAuth]);
  return <></>;
};

export default App;
