import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useNavigate, useParams } from "react-router";
import Menubar from "../components/Menubar";
import useAuthManager from "../auth/useAuthManager";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

const CourseDescription = () => {
  const [courseDetails, setCourseDetails] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);
  const param = useParams();
  const navigate = useNavigate();
  const isAuthenticated = useAuthManager();
  useEffect(() => {
    const fetchData = () => {
      fetch("http://localhost:3000/users/courses")
        .then((res) => res.json())
        .then((data) => {
          setCourseDetails(
            data.courses.find((course) => course.id.toString() === param.id)
          );
          console.log(data.courses, param.id);
        });
    };

    fetchData();
  }, []);

  const handleBuy = () => {
    console.log("handlebuy", isAuthenticated);
    if (isAuthenticated) {
      fetch(`http://localhost:3000/users/courses/${param.id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }).then((res) => {
        if (res.status === 200) {
          console.log("purchased");
          setIsSuccess(true);
          setTimeout(() => {
            navigate("/courses/purchased");
          }, 3000);
        }
        return res.json();
      });
    } else {
      navigate("/login");
    }
  };
  return (
    <>
      <Menubar />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          "& > :not(style)": {
            m: 1,
            width: "100vw",
            height: "100vh",
            padding: "20px",
            textAlign: "center",
          },
        }}
      >
        <Paper
          sx={{
            backgroundImage:
              "url('https://cdn.pixabay.com/photo/2017/05/23/05/33/flower-2336287_1280.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div style={{ backgroundColor: "rgba(255, 255, 255, 0.8)" }}>
            {/* Overlay for better readability */}

            <Typography variant="h4" gutterBottom>
              {courseDetails.title}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Course Description Lorem ipsum dolor sit amet, consectetur
              adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida
              dolor sit amet lacus accumsan et viverra justo commodo. Proin
              sodales pulvinar sic tempor. Sociis natoque penatibus et magnis
              dis parturient montes, nascetur ridiculus mus.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                handleBuy();
              }}
            >
              Buy Now
            </Button>
          </div>
        </Paper>
      </Box>
      <Snackbar
        open={isSuccess}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }} // Set the position to top-right
      >
        <Alert elevation={6} variant="filled" severity="success">
          Course Purchase Successful!!!
        </Alert>
      </Snackbar>
    </>
  );
};

export default CourseDescription;
