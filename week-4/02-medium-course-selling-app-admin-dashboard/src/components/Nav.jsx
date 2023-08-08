import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Nav = () => {
    const navigate = useNavigate()
    const [state, setState] = useState(false);

    useEffect(() => {
        if(localStorage.getItem("token")) {
            setState(true);
        } else {
            setState(false);
        }
    }, [state, localStorage.getItem("token")])

    return (
        <>
            <header className="bg-white shadow-md py-4">
                <div className="container mx-auto px-4">
                    <nav className="flex items-center justify-between">
                        <div className="text-lg font-semibold">Course App</div>
                        <ul className="flex space-x-8">
                                <Link to={"/"}><li className="hover:text-blue-500 cursor-pointer transition-all hover:scale-125 active:scale-95">Home</li></Link>
                                <Link to={"/courses"}><li className="hover:text-blue-500 cursor-pointer transition-all hover:scale-125 active:scale-95">Courses</li></Link>
                                <Link to={"/about"}><li className="hover:text-blue-500 cursor-pointer transition-all hover:scale-125 active:scale-95">Create</li></Link>
                                {!state && <Link to={"/login"}><li className="hover:text-blue-500 cursor-pointer transition-all hover:scale-125 active:scale-95">Login</li></Link>}
                                {!state && <Link to={"/register"}><li className="hover:text-blue-500 cursor-pointer transition-all hover:scale-125 active:scale-95">Register</li></Link>}
                                {state && <li onClick={(e) => {
                                    localStorage.clear();
                                    setState(false);
                                    navigate("/login")
                                }} className="hover:text-blue-500 cursor-pointer transition-all hover:scale-125 active:scale-95">Logout</li>}
                        </ul>
                    </nav>
                </div>
            </header>
        </>
    )
}

export default Nav