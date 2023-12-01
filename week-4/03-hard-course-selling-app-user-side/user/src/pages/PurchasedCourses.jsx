import { useEffect } from "react";
import { useState } from "react";

const PurchesedCourses = () => {
  const [purchasedCourses, setPurchasedCourses] = useState();
  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers = new Headers();
    headers.append("Authorization", `Bearer ${token}`);
    fetch("http://localhost:3000/users/purchasedCourses", {
      method: "GET",
      headers: headers,
    })
      .then((res) => res.json())
      .then((data) => setPurchasedCourses(data.purchasedCourses));
  });
  return (
    <div>
      <h2>PurchesedCourses</h2>
      <div>
        {purchasedCourses &&
          purchasedCourses.map((course) => {
            return (
              <div key={course.id}>
                <div>
                  <h1>{course.title}</h1>
                </div>
                <div>
                  <h3>{course.description}</h3>{" "}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default PurchesedCourses;
