import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { RecoilRoot, useRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";

import "./App.css";
import Todo from "./components/Todos";
import Login from "./components/Login";
import Signup from "./components/Signup";
import authState from "./store/authState";
import { IUser } from "./store/interface";

const App: React.FC = () => {
  return (
    <RecoilRoot>
      <Router>
        <InitState />
        <Routes>
          <Route path="/" element={<Todo />} />
          <Route path="/todos" element={<Todo />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </Router>
    </RecoilRoot>
  );
};

const InitState: React.FC = () => {
  const [auth , setAuth] = useRecoilState(authState);
  const navigate = useNavigate();

  const init = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    if(auth && auth.token && auth.username) {
      return;
    }
    try {
      const response = await fetch("http://localhost:3000/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data: IUser = await response.json();
        setAuth({ token, username: data.username });
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
