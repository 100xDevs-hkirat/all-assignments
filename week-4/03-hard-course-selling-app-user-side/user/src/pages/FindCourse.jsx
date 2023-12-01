import { useEffect } from "react";
import { useParams } from "react-router-dom";
const FindCourse = () => {
  const { id } = useParams();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers = new Headers();
    headers.append("Authorization", `Bearer ${token}`);
    fetch(`http://localhost:3000/users/courses/${id}`, {
      method: "POST",
      headers: headers,
    })
      .then((res) => res.json())
      .then((data) => console.log(data));
  }, [id]);

  return (
    <div>
      Course ID:
      <h4>{id}</h4>
    </div>
  );
};

export default FindCourse;
