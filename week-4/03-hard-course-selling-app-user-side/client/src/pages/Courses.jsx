import { useContext, useEffect } from "react"
import { CourseContext } from "../context/CourseContext"
//import data from './../data/courses'
import Course from "../components/Course";

function Courses() {


    const  { getCourses, state} = useContext(CourseContext);

    const {courses} = state || [];
    const data = courses.courses || []; 

    useEffect( () => {
        getCourses();
    },[])

    return (
        <div className="courses">
        {data.map((item,id) => <Course title={item.title} id={item._id}
        instructor={item.instructor} price={item.price} imageLink={item.imageLink} rating={item.rating} duration={item.duration} key={id}/>)}
        </div>
    )
}

export default Courses
