import { useContext, useEffect } from "react"
import { AuthContext } from "../context/AuthContext"
import { CourseContext } from "../context/CourseContext";
import Course from "../components/Course";

function BuyedCourses() {
    const { state: authState } = useContext(AuthContext);
    const { state: courseState, getbuyedCourses } = useContext(CourseContext);
    const id = authState.user._id;
        console.log(courseState);
    const buyedcourses = courseState.buyedcourse || [];
    console.log("inside coursd down ", buyedcourses)
    useEffect( () => {
        getbuyedCourses(id);
    },[])
    return (
        <div className="courses">
        {buyedcourses.map((item,id) => <Course title={item.title} 
        instructor={item.instructor} price={item.price} imageLink={item.imageLink} rating={item.rating} duration={item.duration} key={id}/>)}
        </div>
    )
}

export default BuyedCourses
