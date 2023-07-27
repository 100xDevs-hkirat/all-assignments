import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { RecoilRoot, useRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";

import "./App.css";
import Todo from "./components/Todo";
import Login from "./components/Login";
import authState from "./store/authState";
import { IUser } from "./store/interface";

const App: React.FC = () => {
  return (
    <RecoilRoot>
      <Router>
        <InitState />
        <Routes>
          <Route path="/" element={<Todo />} />
          <Route path="/Todo" element={<Todo />} />
          <Route path="/Login" element={<Login />} />
        </Routes>
      </Router>
    </RecoilRoot>
  );
};

const InitState: React.FC = () => {
  const [, setAuth] = useRecoilState(authState);
  const navigate = useNavigate();

  const init = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:5173/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data: IUser = await response.json();
      if (data.username) {
        setAuth({ token: data.token, username: data.username });
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
  }, []);
  return <></>;
};

export default App;
