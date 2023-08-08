import React from "react";
import { useRecoilValue } from "recoil";
import { localCourse } from "../recoil.js/atom";
import Card from "./Card";

const Courses = () => {
    // const [courses, setCourses] = React.useState([]);
    const courses = useRecoilValue(localCourse);
    // Add code to fetch courses from the server
    // and set it in the courses state variable.
    return (
        <>
            <div className="bg-gray-100 min-h-screen p-10 flex flex-col justify-center items-center gap-y-8">
                <h1 className="text-3xl drop-shadow-md hover:drop-shadow-2xl transition-all font-semibold tracking-wide font-mono mb-4">Available Courses</h1>
                <div className="flex flex-wrap gap-7 justify-center items-center">
                    {courses.map(course => (
                        <Card key={course.id} course={course} />
                    ))}
                </div>
            </div>
        </>
    )
}


export default Courses;