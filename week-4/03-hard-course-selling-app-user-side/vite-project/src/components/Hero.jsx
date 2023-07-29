import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import Grid from "@mui/material/Grid"; // Import Grid from MUI
import { useNavigate } from "react-router-dom";
const Hero = () => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:3000/users/courses")
        .then((res) => res.json())
        .then((data) => setCourses(data.courses));
    };

    fetchData();
  }, []);
  return (
    <div>
      <Grid container spacing={2}>
        {courses.map((course) => {
          return (
            <Grid key={course.id} item xs={12} sm={6} md={4}>
              <div key={course.id} style={{ margin: "9px 3px" }}>
                <Card sx={{ maxWidth: 560 }}>
                  <CardActionArea
                    onClick={() => {
                      navigate(`/courses/${course.id}`);
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="140"
                      image="https://cdn.pixabay.com/photo/2018/02/27/10/49/training-3185170_1280.jpg"
                      alt="green iguana"
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {course.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Lizards are a widespread group of squamate reptiles,
                        with over 6,000 species, ranging across all continents
                        except Antarctica
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </div>
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
};

export default Hero;
