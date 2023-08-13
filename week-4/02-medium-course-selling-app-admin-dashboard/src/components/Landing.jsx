
import React, { useEffect } from "react";
import { useRecoilState, useRecoilValue, useRecoilValueLoadable, useSetRecoilState } from "recoil";
import { coursesList, user } from "../recoil/atom";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Course from "./Course";

/// This is the landing page. You need to add a link to the login page here.
/// Maybe also check from the backend if the user is already logged in and then show them a logout button
/// Logging a user out is as simple as deleting the token from the local storage.
function Landing() {
    const [client, setClient] = useRecoilState(user);
    const courses = useRecoilValueLoadable(coursesList);
    function getRandomItemsFromArray(arr) {
        const minLength = 1; // Minimum length of the result array
        const maxLength = Math.min(arr.length, 5); // Maximum length of the result array (adjust as needed)
        
        const randomLength = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
        
        // Shuffle the original array to get random items
        const shuffledArr = arr.slice().sort(() => Math.random() - 0.5);
      
        return shuffledArr.slice(0, randomLength);
      }
      let featuredCourses;
      if(courses.state == 'hasValue') {
          featuredCourses = getRandomItemsFromArray(courses.contents);
      }

    return (
        <>
            <div className="bg-gray-100 min-h-screen">

                {/* Hero Section */}
                <section className="py-20 bg-gradient-to-r from-blue-500 to-blue-700 text-white">
                    <div className="container mx-auto text-center">
                        <h1 className="text-4xl font-semibold mb-4">
                            Teach New Skills Online
                        </h1>
                        <p className="text-lg mb-8">
                            Browse our wide range of courses and kickstart your learning journey today.
                        </p>
                        <Link to={"/courses"}><button className="bg-gray-100 text-blue-500 px-6 py-2 rounded-full hover:bg-white transition-all hover:scale-110 active:scale-95">
                            Get Started
                        </button></Link>
                    </div>
                </section>

                {/* Featured Courses */}
                <section className="py-16">
                    <div className="container mx-auto">
                        <h2 className="text-2xl font-semibold mb-8">Featured Courses</h2>
                        {/* Course Cards */}
                        <div className="flex flex-wrap gap-12 justify-start items-center">
                            {/* Repeat this for each featured course */}
                            {courses.state == "hasValue" && featuredCourses.map(fc => <Course key={fc.id} course={fc} updateDel={false} />)}
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-gray-900 text-white py-8">
                    <div className="container mx-auto text-center">
                        <p>&copy; 2023 Course App. All rights reserved.</p>
                    </div>
                </footer>
            </div >
        </>
    )
}

export default Landing;