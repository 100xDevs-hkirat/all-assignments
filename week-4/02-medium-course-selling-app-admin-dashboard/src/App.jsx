import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Landing from "./components/Landing";
import CreateCourse from './components/CreateCourse';
import Register from './components/Register';
import ShowCourses from './components/ShowCourses';
import { createTheme, ThemeProvider} from '@mui/material/styles';
import Header from './sub-components/Header';
import Course from './components/Course';

// This file shows how you can do routing in React.
// Try going to /login, /register, /about, /courses on the website and see how the html changes
// based on the route.
// You can also try going to /random and see what happens (a route that doesnt exist)

const theme = createTheme({
    typography: {
        fontFamily: 'Ubuntu',
    }
});

function App() {
    return (
        <ThemeProvider theme={theme}>
            <Router>
            <Header/>
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/createcourse" element={<CreateCourse />} />
                    <Route path="/courses" element={<ShowCourses />} />
                    <Route path="/course/:courseId" element={<Course />} />
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;