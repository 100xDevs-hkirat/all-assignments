import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { atom, useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

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
    let courses = await axios.get("http://localhost:3000/admin/courses");
    setCourses(courses.data);
    return courses;
  };
  console.log("course details !");
  useEffect(() => {
    getCourses();
  }, []);

  return (
    <div className="w-full">
      <UpdateCourse courseId={courseId} />
      <h1>{courseId}</h1>
      <CourseCard courseId={courseId} />
    </div>
  );
};

export default Course;

export const UpdateCourse = (props) => {
  console.log("update course re-rendering !");

  // eslint-disable-next-line react/prop-types
  const courseId = props?.courseId;

  const [courses, setCourses] = useRecoilState(couresState);
  const [course, setCourse] = useState({id: courseId, name: "", desc: "", author: "" });
  const [status, setStatus] = useState("");

  useEffect(() => {}, []);

  const updatedCourses = [...courses];

  const updateCourse = async (e) => {
    e.preventDefault();
    // console.log("course : ", course);
    try {
      await axios
        .put(
          "http://localhost:3000/admin/courses/" + courseId,
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
          updatedCourses.push(course);
          setStatus(course.name + " updated in succesfully !");
        })

        .catch((err) => {
          console.log(err);
          setStatus("Please Login before accessing this page !");
        });
      setCourses(updatedCourses);
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

// ! courseCard
// eslint-disable-next-line react/prop-types
export const CourseCard = ({ courseId }) => {
  const courses = useRecoilValue(couresState);
  console.log("courses : ", courses);
  console.log("Course updated so re-rendering !");

  let course = null;
  if (courses.length > 0) {
    for (let i = 0; i < courses.length; i++) {
      if (courses[i].id == courseId) {
        course = courses[i];
      }
    }
  }

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
      <div
        className="flex bg-gray-200 px-6 py-4 border-b
       border-gray-300 flex-col space-y-1"
      >
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
