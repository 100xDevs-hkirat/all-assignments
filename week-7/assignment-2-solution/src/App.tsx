import React, {useEffect} from 'react';
import {BrowserRouter as Router, Route, Routes, NavigateFunction} from 'react-router-dom';
import {RecoilRoot} from 'recoil';
import Login from './Components/Login';
import Signup from './Components/Signup';
import TodoList from './Components/TodoList';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { authState } from './store/authState.js';

const App: React.FC = () => {
    return (
        <RecoilRoot>
            <Router>
                <InitState />
                <Routes>
                    <Route path='/login' element={<Login />} />
                    <Route path='/signup' element={<Signup />} />
                    <Route path='/todos' element={<TodoList />} />
                    <Route path='/' element={<Login />} />
                </Routes>
            </Router>
        </RecoilRoot>
    );
}

const InitState: React.FC = () => {
    const setAuth = useSetRecoilState(authState);
    const navigate: NavigateFunction = useNavigate();

    const init = async () => {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch('http://localhost:3000/auth/me', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.username) {
                setAuth({ token: data.token, username: data.username });
                navigate("/todos");
            } else {
                navigate("/login");
            }
        } catch (e) {
            navigate("/login");
        }
    }
    useEffect(() => {
        init();
    }, [])
    return <></>
}

export default App;

