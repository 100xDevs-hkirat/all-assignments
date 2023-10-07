import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
/// You need to add input boxes to take input for users to create a course.
/// I've added one input so you understand the api to do it.
function CreateCourse() {
  const [course, setCourse] = React.useState({
    name: "",
    desc: "",
    author: "",
  });
  const [status, setStatus] = useState("");
  const [courses, setCourses] = useState([]);
  const [user, setUser] = useState("");

  const navigate = useNavigate();

  const getCourses = async () => {
    let courses = await axios.get("http://localhost:3000/admin/courses");
    setCourses(courses.data);
    return courses;
  };

  const getUsername = async () => {
    let username = await axios.get("http://localhost:3000/admin/me", {
      headers: { Authorization: "Bearer " + localStorage.getItem("token") },
    });
    // console.log('user name : ', username)
    setUser(username.data.username);
    return username;
  };

  console.log("user : ", user);

  useEffect(() => {
    getUsername();
    getCourses();
  }, []);

  const addCourse = async (e) => {
    e.preventDefault();
    console.log("course : ", course);
    try {
      await axios
        .post(
          "http://localhost:3000/admin/courses",
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
          setStatus(course.name + " added in succesfully !");
          getCourses();
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

  console.log('courses : ', courses)


  return (
    <div className="px-4">
      <div className="flex justify-between items-center">
        <h1
          className="text-center text-[1.7rem] cursor-pointer font-semibold text-blue-500"
          onClick={() => navigate("/")}
        >
          Coursera
        </h1>
        {localStorage.getItem("token") == "undefined" && (
          <button
            className="bg-blue-400 text-white px-6 py-1 rounded-md"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        )}
        {user && (
          <h2 className="bg-gray-200 font-semibold text-[1.3rem] px-4 rounded-md text-gray-900">
            {user}
          </h2>
        )}
      </div>
      <div className="flex border-b border-gray-800 flex-col py-4">
        <div className="font-semibold text-[1.2rem] text-gray-800">
          Create Course :
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
              onClick={(e) => addCourse(e)}
            >
              Create Course
            </button>
          </div>
        </div>
      </div>
      <div className="pt-4">
        <h1 className="font-semibold text-[1.2rem]">Course List : </h1>
        <div className="px-20 flex flex-col space-y-1 text-[0.9rem]">
          {courses &&
            courses.map((c, i = i + 1) => (
              <div
                onClick={()=>navigate(`/course/${c.id}`)}
                className="flex hover:bg-gray-200 rounded-md px-2
                cursor-pointer py-4 border-b border-gray-300 flex-col space-y-1"
                key={i}
              >
                {/* name */}
                {/* <div className="flex space-x-2"> */}
                <p>{i}</p>
                <h4>Name : {c.name}</h4>
                <h4>Description : {c.desc}</h4>
                <h4>Author : {c.author}</h4>
                {/* </div> */}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
export default CreateCourse;
