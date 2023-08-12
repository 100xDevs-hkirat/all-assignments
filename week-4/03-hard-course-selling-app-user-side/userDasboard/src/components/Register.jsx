import React, { useEffect, useRef } from "react";
import { useRecoilState } from "recoil";
import axios from "axios";
import { toast } from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom';
import { baseUrl } from "../recoil.js/atom";


/// File is incomplete. You need to add input boxes to take input for users to register.
function Register() {

    const usernameRef = useRef(null);
    const passwordRef = useRef(null);
    const emailRef = useRef(null);
    const navigate = useNavigate();
    const token = sessionStorage.getItem("userToken") || null;

    useEffect(() => {
        if(token) {
            toast.success("Cleaning Client Data");
            sessionStorage.clear();
        }
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post(`${baseUrl}/users/signup`, {
            username: usernameRef.current.value,
            password: passwordRef.current.value
        }, {
            headers: {
                "Content-type": "application/json"
            }
        }).then(response => {
            usernameRef.current.value = '';
            passwordRef.current.value = '';
            emailRef.current.value = '';
            sessionStorage.setItem("userToken", response.data.token);
            toast.success(response.data.message);
            navigate("/");
        }).catch(err => {
            if (err) {
                if (err.response.status == 403) {
                    toast.error("Username already exist");
                }
            }
        })

    }

    return (
        <>
            <div className="flex h-screen bg-gray-100">
                <div className="m-auto bg-white rounded-lg p-8 shadow-md w-[400px] hover:shadow-2xl transition-all">
                    <h2 className="text-2xl font-semibold mb-4">Register</h2>
                    <form
                        onSubmit={handleSubmit}
                    >
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-600 mb-1">Username</label>
                            <input
                                type="text"
                                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                                placeholder="Pick a fancy One"
                                required
                                ref={usernameRef}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                            <input
                                type="email"
                                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                                placeholder="you@example.com"
                                ref={emailRef}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-600 mb-1">Password</label>
                            <input
                                type="password"
                                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                                placeholder="Enter your password"
                                required
                                ref={passwordRef}
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white rounded-lg py-2 font-medium hover:bg-blue-600"
                        >
                            Sign Up
                        </button>
                    </form>
                    <Link to={"/login"}>
                        <button
                            type="button"
                            className="w-full bg-blue-500 mt-5 text-white rounded-lg py-2 font-medium hover:bg-blue-600"
                        >
                            Login?
                        </button>
                    </Link>
                </div>
            </div>
        </>
    )
}

export default Register;