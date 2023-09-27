import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Course = () => {
  const { courseId } = useParams();
  const [courses, setCourses] = useState("");

  const getCourses = async () => {
    let courses = await axios.get("http://localhost:3000/admin/courses");
    setCourses(courses.data);
    return courses;
  };
  useEffect(() => {
    getCourses();
  }, [courses]);
  let course = null;
  if (courses) {
    for (let i = 0; i < courses.length; i++) {
      if (courses[i].id == courseId) {
        console.log("courseFound : ", courses[i]);
        course = courses[i];
      }
    }
  }

  if (!course) {
    return (
      <div className="w-full mx-auto">
        Searching for your couse Hang on tight !!!
      </div>
    );
  }

  return (
    <div className="w-full">
      <h1>{courseId}</h1>
          <UpdateCourse courseId={course} />
        <div className="flex bg-gray-200 py-4 border-b border-gray-300 flex-col space-y-1">
          {/* name */}
          {/* <div className="flex space-x-2"> */}
          <h4>Name : {course.name}</h4>
          <h4>Description : {course.desc}</h4>
          <h4>Author : {course.author}</h4>
          {/* </div> */}
        </div>
      </div>
  );
};

export default Course;

import React from "react";

export const UpdateCourse = (props) => {
  const courseId = props?.courseId;
  const [course, setCourse] = React.useState({
    name: "",
    desc: "",
    author: "",
  });
  const [status, setStatus] = useState("");

  useEffect(() => {}, []);

  const updateCourse = async (e) => {
    e.preventDefault();
    console.log("course : ", course);
    try {
      await axios
        .put(
          "http://localhost:3000/admin/courses/" + courseId.id,
          {
            name: course.name,
            desc: course.desc,
            author: course.author,
          },
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        )
        .then((e) => {
          console.log(e);
          setStatus(course.name + " updated in succesfully !");
        })
        .catch((err) => {
          console.log(err);
          setStatus("Please Login before accessing this page !");
        });
    } catch (e) {
      console.log(e);
      setStatus("this course already exists in courses.json file !");
    }
  };
  return (
    <div>
      <div className="flex border-b border-gray-800 flex-col py-4">
        <div className="font-semibold text-[1.2rem] text-gray-800">
          {/* Course : {} */}
        </div>
        <div className="py-5 px-20 flex flex-col space-y-2">
          {status && (
            <p className="text-red-600 font-semibold text-[0.9rem] text-center">
              {status}
            </p>
          )}
          <input
            type={"text"}
            className="outline-none"
            placeholder="name"
            value={course.name}
            onChange={(e) => setCourse({ ...course, name: e.target.value })}
          />
          <input
            type={"text"}
            className="outline-none"
            placeholder="description"
            value={course.desc}
            onChange={(e) => setCourse({ ...course, desc: e.target.value })}
          />
          <input
            type={"text"}
            className="outline-none"
            placeholder="author"
            value={course.author}
            onChange={(e) => setCourse({ ...course, author: e.target.value })}
          />
          <div className="pt-10">
            <button
              className="px-3 py-1 hover:bg-green-400 bg-green-600 rounded-md"
              onClick={(e) => updateCourse(e)}
            >
              Update Course
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
