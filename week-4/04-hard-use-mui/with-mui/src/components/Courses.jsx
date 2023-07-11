import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PropTypes from "prop-types";
import { SnackbarContext } from "./SnackbarContext.jsx";
import SnackbarAlert from "./SnackbarAlert.jsx";
// mui
import {
  Card,
  CardContent,
  Typography,
  Grid,
  CardMedia,
  Button,
} from "@mui/material";

function Courses() {
  const [courses, setCourses] = useState([]);
  const { showSnackbar } = useContext(SnackbarContext);

  useEffect(() => {
    axios
      .get("http://localhost:3000/users/courses", {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setCourses(res.data.courses);
      })
      .catch((err) => {
        showSnackbar(err.response.data.message || err.toString(), "error");
        console.error(err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <h1>Courses Page</h1>
      <br />
      <Grid container spacing={2}>
        {courses.map((course) => {
          // return Course(course);
          return (
            <Grid key={course.id} item xs={12} sm={6} md={14}>
              <Course key={course.id} {...course} />
            </Grid>
          );
        })}
      </Grid>
      <SnackbarAlert />
    </div>
  );
}

function Course(props) {
  const { title, price, description, imageLink, id } = props;
  const navigate = useNavigate();

  function handlePurchase() {
    navigate(`/courses/${id}`);
  }

  return (
    <Card variant="outlined">
      <CardContent>
        <Grid container spacing={1}>
          <Grid item xs={12} sm={2}>
            <CardMedia
              component="img"
              src={imageLink}
              sx={{ width: "100%", maxWidth: 200, maxHeight: 100 }}
            />
          </Grid>
          <Grid item xs={12} sm={8}>
            <Typography variant="h6" gutterBottom>
              {title}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Price: {price}
            </Typography>
            <Typography variant="body1" gutterBottom>
              {description}
            </Typography>
          </Grid>
          <Button onClick={handlePurchase}>Purchase</Button>
        </Grid>
      </CardContent>
    </Card>
  );
}

Course.propTypes = {
  id: PropTypes.number,
  title: PropTypes.string,
  price: PropTypes.number,
  published: PropTypes.bool,
  description: PropTypes.string,
  imageLink: PropTypes.string,
};
export default Courses;
