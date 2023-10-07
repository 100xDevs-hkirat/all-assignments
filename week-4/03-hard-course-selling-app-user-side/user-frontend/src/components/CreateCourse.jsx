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
  const [purchasedCourses, setPurchasedCourses] = useState([]);
  const [user, setUser] = useState("");

  const navigate = useNavigate();

  const getCourses = async () => {
    let res = await axios.get("http://localhost:3000/user/courses", {
      headers: { Authorization: "Bearer " + localStorage.getItem("token") },
    });
    setCourses(res.data.courses);
    console.log("courses : ", courses);
    return courses;
  };

  const getPurchasedCourses = async () => {
    let res = await axios.get("http://localhost:3000/user/purchasedCourses", {
      headers: { Authorization: "Bearer " + localStorage.getItem("token") },
    });
    setPurchasedCourses(res.data.purchasedCourses);
    console.log("purchasedCourses : ", res.data.purchasedCourses);
    return courses;
  };

  const getUsername = async () => {
    let res = await axios.get("http://localhost:3000/user/me", {
      headers: { Authorization: "Bearer " + localStorage.getItem("token") },
    });
    // console.log('user name : ', username)
    setUser(res.data.username);
    return res.data.username;
  };

  console.log("user : ", user);

  useEffect(() => {
    getUsername();
    getCourses();
    getPurchasedCourses();
  }, []);

  const addCourse = async (e) => {
    e.preventDefault();
    console.log("course : ", course);
    try {
      await axios
        .post(
          "http://localhost:3000/user/courses",
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

  console.log("courses : ", courses);

  return (
    <div className="px-4 w-[100vw]">
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
            className="outline-none px-2 py-2 rounded-md text-gray-200 sm:w-[400px]"
            placeholder="name"
            value={course.name}
            onChange={(e) => setCourse({ ...course, name: e.target.value })}
          />
          <input
            type={"text"}
            className="outline-none px-2 py-2 rounded-md text-gray-200 sm:w-[400px]"
            placeholder="description"
            value={course.desc}
            onChange={(e) => setCourse({ ...course, desc: e.target.value })}
          />
          <input
            type={"text"}
            className="outline-none px-2 py-2 rounded-md text-gray-200 sm:w-[400px]"
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
      <div className="pt-4 flex flex-grow justify-between">
        {/* all courses */}
        <div className="flex-1 border-r border-gray-600">
          <h1 className="font-semibold text-[1.2rem]">Course List : </h1>
          <div className="px-2 flex flex-col space-y-1 text-[0.9rem]">
            {courses &&
              courses.map((c, i = i + 1) => (
                <div
                  onClick={() => navigate(`/course/${c._id}`)}
                  className="flex hover:bg-gray-800 rounded-md px-2
                cursor-pointer py-4 border-b border-gray-300 flex-col space-y-1"
                  key={i}
                >
                  {/* name */}
                  {/* <div className="flex space-x-2"> */}
                  <p>{i}</p>
                  <h4>Name : {c.title}</h4>
                  <h4>Description : {c.description}</h4>
                  <h4>Author : {c.price}</h4>
                  <h4>Published : {c.published ? "true" : "false"}</h4>
                  {/* </div> */}
                </div>
              ))}
          </div>
        </div>
        {/* purchasedCourses */}
        <div className="flex-1 ml-4">
          <h1 className="font-semibold text-[1.2rem]">Purchased Courses : </h1>
          <div className="mr-auto px-2
           flex flex-col space-y-1 text-[0.9rem]">
            {!purchasedCourses ?
              <h2 className="mt-10 text-red-600 mx-auto">You have not yet purchased any course !</h2>
              : purchasedCourses.map((c, i = i + 1) => (
                <div
                  onClick={() => navigate(`/course/${c._id}`)}
                  className="flex hover:bg-gray-800 rounded-md px-2
                cursor-pointer py-4 border-b border-gray-300 flex-col space-y-1"
                  key={i}
                >
                  {/* name */}
                  {/* <div className="flex space-x-2"> */}
                  <p>{i}</p>
                  <h4>Name : {c.title}</h4>
                  <h4>Description : {c.description}</h4>
                  <h4>Author : {c.price}</h4>
                  <h4>Published : {c.published ? "true" : "false"}</h4>
                  {/* </div> */}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
export default CreateCourse;
