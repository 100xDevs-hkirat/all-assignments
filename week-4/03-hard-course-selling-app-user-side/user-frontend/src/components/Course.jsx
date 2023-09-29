import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { atom, useSetRecoilState } from "recoil";
import Navbar from "./Navbar";

// ? recoil concept !
const couresState = atom({
  key: "courseState", // unique ID (with respect to other atoms/selectors)
  default: [], // default value (aka initial value)
});

const Course = () => {
  const { courseId } = useParams();
  // const [courses, setCourses] = useState("");
  const setCourses = useSetRecoilState(couresState);
  console.log("COURSE re-rendering !");

  const getCourses = async () => {
    let courses = await axios.get("http://localhost:3000/user/courses");
    setCourses(courses.data);
    return courses;
  };
  useEffect(() => {
    getCourses();
  }, []);

  return (
    <div className="w-[100vw] flex flex-col h-[100vh] space-y-10">
      <Navbar />
      <CourseCard courseId={courseId} />
      <p className="text-[0.8rem] text-gray-300">{courseId}</p>
    </div>
  );
};

export default Course;

// ! courseCard
// eslint-disable-next-line react/prop-types
export const CourseCard = ({ courseId }) => {
  const [course, setCourse] = useState();
  const [status, setStatus] = useState('');

  const purchaseCourse = async () => {
    await axios.post(
      "http://localhost:3000/user/purchaseCourse",
      { id: courseId },
      {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      }
    ).then(res => {
      console.log('data : ', res.data);
      setStatus(res.data.message);
    }).catch(err => {
      console.log(err);
    })
  };

  const getCourse = async () => {
    const res = await axios.get(
      "http://localhost:3000/user/course/" + courseId,
      { headers: { Authorization: "Bearer " + localStorage.getItem("token") } }
    );
    console.log("res : ", res);
    setCourse(res.data.course);
  };
  useEffect(() => {
    getCourse();
  }, []);

  console.log("course : ", course);

  if (!course) {
    return (
      <div
        className="w-full pl-10 mx-auto font-semibold 
      text-red-400"
      >
        Searching for your course Hang on tight !!!
      </div>
    );
  }
  return (
    <div>
      <marquee className='text-red-600 font-bold text-[1.3rem]'>{status}</marquee>
      <div
        className="flex bg-gray-900 text-[1.3rem] px-6 py-4 border-b
       border-gray-300 flex-col space-y-1"
      >
        {/* name */}
        {/* <div className="flex space-x-2"> */}
        <h4>Name : {course.title}</h4>
        <h4>Description : {course.description}</h4>
        <h4>Author : {course.price}</h4>
        <h4>Published : {course.published ? "true" : "false"}</h4>
        {/* </div> */}
        <div>
          <button
            onClick={purchaseCourse}
            className="bg-green-800 w-[400px] mt-10 mr-auto"
          >
            Purchase Course
          </button>
        </div>
      </div>
    </div>
  );
};
