import { useState, useEffect } from "react";

const useAuthManager = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/users/purchasedCourses",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.status === 200) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        // Handle any errors that occurred during the fetch here
        setIsAuthenticated(false);
      }
    };

    fetchData();
  }, []);

  return isAuthenticated;
};

export default useAuthManager;
