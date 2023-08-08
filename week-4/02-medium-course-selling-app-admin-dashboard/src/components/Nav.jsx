import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Nav = () => {
    return (
        <>
            <header className="bg-white shadow-md py-4">
                <div className="container mx-auto px-4">
                    <nav className="flex items-center justify-between">
                        <Link to={"/"}><div className="text-lg font-semibold cursor-pointer">Course App</div></Link>
                        <ul className="flex space-x-8">
                                <Link to={"/"}><li className="hover:text-blue-500 cursor-pointer transition-all hover:scale-125 active:scale-95">Home</li></Link>
                                <Link to={"/courses"}><li className="hover:text-blue-500 cursor-pointer transition-all hover:scale-125 active:scale-95">Courses</li></Link>
                                <Link to={"/about"}><li className="hover:text-blue-500 cursor-pointer transition-all hover:scale-125 active:scale-95">Create</li></Link>
                                <Link to={"/login"}><li className="hover:text-blue-500 cursor-pointer transition-all hover:scale-125 active:scale-95">Login</li></Link>
                                <Link to={"/register"}><li className="hover:text-blue-500 cursor-pointer transition-all hover:scale-125 active:scale-95">Register</li></Link>
                        </ul>
                    </nav>
                </div>
            </header>
        </>
    )
}

export default Nav