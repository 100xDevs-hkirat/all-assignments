import { useContext } from "react";
import { CourseDetails } from "../../courseContext";

const ShowCourse = () => {
  const [courses] = useContext(CourseDetails);
  return (
    <div>
      <div>All Courses</div>
      <br />
      <br />
      <div>
        {courses &&
          courses.map((course) => {
            return (
              <div key={course.id}>
                <div>
                  <h1>{course.title}</h1>
                </div>
                <div>
                  <p>{course.description}</p>
                </div>
                <div>
                  <h3>₹{course.price}</h3>
                </div>
                <br />
                <br />
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default ShowCourse;
