import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const EditCourse = () => {
  const param = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = React.useState("");
  const editCourse = () => {
    fetch(`http://localhost:3000/admin/courses/${param.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ title }),
    }).then(() => {
      navigate("/courses");
    });
  };
  return (
    <>
      {/* {JSON.stringify(param)} */}
      <div>EditCourse</div>
      <div>
        <input value={title} onChange={(e) => setTitle(e.target.value)} />
        <button
          onClick={() => {
            editCourse();
          }}
        >
          Edit Course
        </button>
      </div>
    </>
  );
};

export default EditCourse;
