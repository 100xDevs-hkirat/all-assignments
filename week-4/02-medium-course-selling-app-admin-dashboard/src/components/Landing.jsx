
import React, { useEffect } from "react";
import { useRecoilState, useRecoilValue, useRecoilValueLoadable, useSetRecoilState } from "recoil";
import { coursesList, user } from "../recoil/atom";
import { Link, useNavigate } from "react-router-dom";

/// This is the landing page. You need to add a link to the login page here.
/// Maybe also check from the backend if the user is already logged in and then show them a logout button
/// Logging a user out is as simple as deleting the token from the local storage.
function Landing() {
    const [client, setClient] = useRecoilState(user);
    const courses = useRecoilValueLoadable(coursesList);
    const navigate = useNavigate();

    return <div>
        <h1>Welcome to course selling website!</h1>
        <a href="/register">Register</a>
        <br/>
        <a href="/login">Login</a>
        <Link to={"/courses"}>Courses</Link>
        <Link to={"/about"}>About</Link>
    </div>
}

export default Landing;