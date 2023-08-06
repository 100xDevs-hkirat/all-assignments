import { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { RecoilRoot, useSetRecoilState } from "recoil";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import TodoList from "./Components/TodoList";
import { useNavigate } from "react-router-dom";
import { authState } from "./store/authState";
import { UserMe, UsernameToken } from "./types";
import { ENV } from "./env";

function App() {
  return (
    <RecoilRoot>
      <Router>
        <InitState />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/todos" element={<TodoList />} />
          <Route path="/" element={<Login />} />
        </Routes>
      </Router>
    </RecoilRoot>
  );
}

function InitState() {
  const setAuth = useSetRecoilState(authState);
  const navigate = useNavigate();

  const init = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${ENV.VITE_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data: UserMe = await response.json();
      if (data.username) {
        setAuth((auth: UsernameToken) => ({
          token: auth.token,
          username: data.username,
        }));
        navigate("/todos");
      } else {
        navigate("/login");
      }
    } catch (e) {
      console.log(e);
      navigate("/login");
    }
  };
  useEffect(() => {
    init();
  }, []);
  return <></>;
}

export default App;
