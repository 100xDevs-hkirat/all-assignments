import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { baseUrl } from '../recoil.js/atom';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

const PurchasedCourse = () => {
  const [courses, setCourses] = useState([]);
  
  useEffect(() => {
    axios({
      url: "/users/purchasedCourses",
      baseURL: baseUrl,
      method: "GET",
      headers: {
        Authorization: sessionStorage.getItem("userToken"),
        "Content-type": "application/json"
      }
    }).then(response => {
      setCourses(response.data.purchasedCourses);
    }).catch(err => {
      if(err) {
        toast.error(err.message);
      }
    })
  }, []);

  return (
    <>
      <div className="bg-gray-100 min-h-screen p-10 flex flex-col justify-center items-center gap-y-8">
      <h1  className="text-3xl drop-shadow-md hover:drop-shadow-2xl transition-all font-semibold tracking-wide font-mono mb-4">{courses.length > 0 ? "Purchased Courses" : <Link to={"/courses"}>Start Learning</Link>}</h1>
        <div className="flex flex-wrap gap-7 justify-center items-center">
          {courses.map(course => (
            <Card key={course.id} course={course} />
          ))}
        </div>
      </div>
    </>
  )
}

export default PurchasedCourse