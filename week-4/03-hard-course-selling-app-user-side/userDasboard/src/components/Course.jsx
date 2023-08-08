import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useRecoilState, useRecoilValue } from 'recoil';
import { baseUrl, localCourse, pCourses } from '../recoil.js/atom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const Course = () => {
  const {slug} = useParams();
  const [purCourses, setPurCourse] = useRecoilState(pCourses);
  const allCourses = useRecoilValue(localCourse);
  const [course, setCourse] = useState(purCourses.find(cou => cou.id == slug) || {})
  const [purchase, setPurchase] = useState(false);
  useEffect(() => {
    if(!Object.keys(course).length || course == undefined) {
      const c = allCourses.find(co => co.id == slug);
      setCourse(c);
      setPurchase(false);
    } else {
      setPurchase(true);
    }
  }, [])

  const handlePurchase = () => {
    axios({
      url: `/users/courses/${slug}`,
      baseURL: baseUrl,
      method: "POST",
      headers: {
        Authorization: sessionStorage.getItem("userToken"),
        "Content-Type": "application/json"
      }
    }).then(response => {
      setPurchase(true);
      setPurCourse(pre => [...pre, course])
      toast.success(response.data.message);
    }).catch(err => {
      if(err) {
        if(err.response.status == 403) {
          toast.error("Auth Token Expired!");
          sessionStorage.clear();
          navigate("/login");
        } else {
          toast.error(err.message);
        }
      }
    })
  }

  return (
    <>
      <div className="bg-gray-100 min-h-screen p-10">
        <div className="max-w-2xl mx-auto bg-white p-6 flex flex-col gap-y-5 shadow-md rounded-lg">
          <div className="">
          <h1 className="text-3xl font-semibold mb-4">{course.title}</h1>
          <p className="text-gray-600 mb-4">{course.description}</p>
          <p className="text-gray-800 mb-4">{course.content}</p>
          <div className="text-gray-600">
            <strong>Instructor:</strong> {course.instructor}
          </div>
          </div>
          {!purchase && <button 
            onClick={handlePurchase}
            className="bg-blue-500 w-fit text-gray-100 px-6 py-2 rounded-2xl hover:bg-blue-600 transition-all hover:scale-110 active:scale-95"
          >
            Enroll Now
          </button>}
        </div>
      </div >
    </>
  )
}

export default Course