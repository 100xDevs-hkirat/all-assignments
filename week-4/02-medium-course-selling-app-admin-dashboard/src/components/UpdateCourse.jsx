import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function UpdateCourse() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [title, setTitle] = React.useState("");
  const [price, setPrice] = React.useState("");

  const [startDate, setStartDate] = React.useState("");
  const [courses, setCourses] = React.useState([]);

  useEffect(() => {
    getCourses();
  }, []);

  const getCourses = async () => {
    try {
      const response = await fetch(`http://localhost:3000/admin/course/${id}`);
      const data = await response.json();

      setCourses(data.courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  console.log(courses);

  const handleUpdate = async () => {
    const sendData = await fetch(`http://localhost:3000/admin/courses/${id}`, {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("Token")}`,
      },

      body: JSON.stringify({
        title: title,
        startDate: startDate,
      }),
    });

    const response = await sendData.json();

    alert("Course Updated");
    navigate("/courses");
  };

  return (
    <div className="createCourse">
      <div className="createCourseContainer">
        <h1 className="createCourseHeading">Update Course Page</h1>
        <div className="inputContainer">
          {" "}
          <label className="createCourseLable">Title</label>
          <input
            type={"text"}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="inputContainer">
          <label className="createCourseLable">Start Date</label>
          <input
            value={startDate}
            type="date"
            id="date"
            onChange={(e) => setStartDate(e.target.value)}
          />

          
<div className = "inputContainer"> <label className="createCourseLable">Price in Rupees</label>
        <input              value={price}
type={"number"} onChange={e => setPrice(e.target.value)} /></div>
        </div>
        <button className="createCourseButton" onClick={handleUpdate}>
          Update Course
        </button>
      </div>
    </div>
  );
}
