import React from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { SnackbarContext } from './SnackbarContext';
// mui
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

function PurchaseCourse() {
  const { courseId } = useParams();
  const [course, setCourse] = React.useState({});
  const navigate = useNavigate();
  const { snackbarState, showSnackbar, closeSnackbar } = React.useContext(SnackbarContext);

  React.useEffect(() => {
    axios
      .get(`http://localhost:3000/users/courses/${courseId}`, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setCourse(res.data.course);
      })
      .catch((err) => {
        showSnackbar(err.response.data.message, "error");
        console.error(err)
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  function purchaseCourse() {
    axios
      .post(
        `http://localhost:3000/users/courses/${courseId}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        showSnackbar(res.data.message, "success");
      })
      .catch((err) => {
        showSnackbar(err.response.data.message, "error");
        console.error(err);
      }).finally(() => navigate("/courses/purchased"));
  }

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Purchase Course
      </Typography>
      <Card variant="outlined">
        <CardContent>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={2}>
              <CardMedia
                component="img"
                src={course.imageLink}
                sx={{ width: "100%", maxWidth: 150 }}
              />
            </Grid>
            <Grid item xs={12} sm={8}>
              <Typography variant="h6" gutterBottom>
                {course.title}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Price: {course.price}
              </Typography>
              <Typography variant="body1" gutterBottom>
                {course.description}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Button variant="contained" onClick={purchaseCourse}>
        Purchase
      </Button>
      <Snackbar open={snackbarState.open} onClose={closeSnackbar}>
        <Alert severity={snackbarState.severity}>{snackbarState.message}</Alert>
      </Snackbar>
    </div>
  );
}

export default PurchaseCourse;
