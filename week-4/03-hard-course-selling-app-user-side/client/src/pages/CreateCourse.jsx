import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { CourseContext } from "../context/CourseContext";

function CreateCourse() {
        const navigate = useNavigate();
        const {state: authState } = useContext(AuthContext);
        const { createCourse } = useContext(CourseContext);
    const [courseData, setCourseData] = useState({
        title: "",
        instructor: "",
        duration: "",
        description: "",
        price: "",
        imageLink: "",
        rating: "",
      });
    
      const handleChange = (e) => {
        const { name, value } = e.target;
        setCourseData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      };
    
      const handleSubmit = () => {
        
        console.log(courseData);
        createCourse({...courseData});

        navigate("/")
        setCourseData({
          title: "",
          instructor: "",
          duration: "",
          description: "",
          price: "",
          imageLink: "",
          rating: "",
        });
      };
    
      return (
        <div className="container">
          <div className="form">
            <h3>Create a Course</h3>
              <div className="input-group">
                <input
                  type="text" name="title" placeholder="Title" value={courseData.title} onChange={handleChange} required
                />
                <input
                  type="text"  name="instructor" placeholder="Instructor" value={courseData.instructor} onChange={handleChange} required
                />
                <input
                  type="text" name="duration" placeholder="Duration" value={courseData.duration} onChange={handleChange}
                  required
                />
                <input
                  type="text" name="description" placeholder="Description" value={courseData.description} onChange={handleChange}
                  required
                />
                <input
                  type="text" name="price" placeholder="Price" value={courseData.price} onChange={handleChange}
                  required
                />
                <input
                  type="text" name="imageLink" placeholder="Image Link" value={courseData.imageLink} onChange={handleChange}
                  required
                />
                <input
                  type="text" name="rating" placeholder="Rating" value={courseData.rating} onChange={handleChange}
                  required
                />
              </div>
              <button  onClick={handleSubmit}>Create Course</button>
          </div>
        </div>
      );
}

export default CreateCourse
