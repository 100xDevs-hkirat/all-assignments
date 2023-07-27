import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./Components/Login";
import SignUp from "./Components/SignUp";
import TodoList from "./Components/TodoList";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/signup" element={<SignUp />}></Route>
        <Route path="/todos" element={<TodoList />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
