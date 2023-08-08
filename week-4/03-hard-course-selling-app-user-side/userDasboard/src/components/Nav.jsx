import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom'
import { useRecoilState } from 'recoil';

const Nav = () => {
    const navigate = useNavigate();
    const [state, setState] = useState(false);
    useEffect(() => {
        if(sessionStorage.getItem("userToken")) {
            setState(true);
        } else {
            setState(false);
        }
    }, [state, sessionStorage.getItem("userToken")]);
    return (
        <>
            <header className="bg-white shadow-md py-4 sticky z-50 top-0 w-full  opacity-95" >
                <div className="container mx-auto px-4 " >
                    <nav className="flex items-center justify-between ">
                        <Link to={"/"}><div className="text-lg font-semibold cursor-pointer">Course App</div></Link>
                        <ul className="flex space-x-8">
                                <Link to={"/"}><li className="hover:text-blue-500 cursor-pointer transition-all hover:scale-125 active:scale-95">Home</li></Link>
                                <Link to={"/courses"}><li className="hover:text-blue-500 cursor-pointer transition-all hover:scale-125 active:scale-95">Courses</li></Link>
                                <Link to={"/purchase"}><li className="hover:text-blue-500 cursor-pointer transition-all hover:scale-125 active:scale-95">Purchased</li></Link>
                                {!state && <Link to={"/login"}><li className="hover:text-blue-500 cursor-pointer transition-all hover:scale-125 active:scale-95">Login</li></Link>}
                                {!state && <Link to={"/register"}><li className="hover:text-blue-500 cursor-pointer transition-all hover:scale-125 active:scale-95">Register</li></Link>}
                                {state && <li onClick={(e) => {
                                    sessionStorage.clear();
                                    setState(false);
                                    toast.success("Logged Out")
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