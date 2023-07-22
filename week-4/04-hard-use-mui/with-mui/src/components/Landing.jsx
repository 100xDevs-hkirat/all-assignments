import React from 'react';
import { Typography, Button, Container, Grid, Paper } from "@mui/material";

function Landing() {
  const isLoggedIn = React.useState(localStorage.getItem("token") || "");
  return (
    <div>
      {/* Hero Section */}
      <Container
        maxWidth="lg"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f0f0f0",
          padding: "5rem 0",
        }}
      >
        <Typography variant="h2" component="h1" align="center" gutterBottom>
          Welcome to Our Online Course Platform
        </Typography>
        <Typography variant="h5" component="p" align="center" gutterBottom>
          Unlock your potential with our wide range of high-quality courses taught by industry experts.
        </Typography>
        <Button variant="contained" color="primary" size="large" sx={{ marginTop: "2rem" }}>
          Explore Courses
        </Button>
      </Container>

      {/* Featured Courses Section */}
      <Container
        maxWidth="lg"
        sx={{ marginTop: "4rem", marginBottom: "2rem", padding: "2rem", backgroundColor: "#fff" }}
      >
        <Typography variant="h4" component="h2" align="center" gutterBottom>
          Featured Courses
        </Typography>
        <Grid container spacing={3} sx={{ marginTop: "2rem" }}>
          {/* Featured Course 1 */}
          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={{ padding: "1rem", height: "100%" }}> {/* CourseCard Component */}
              <Typography variant="h6" gutterBottom>
                Course Title
              </Typography>
              <Typography variant="body2" gutterBottom>
                Instructor Name
              </Typography>
              <Typography variant="body1" sx={{ marginTop: "1rem" }}>
                Course Description
              </Typography>
              <Button variant="outlined" color="primary" size="small" sx={{ marginTop: "1rem" }}>
                Learn More
              </Button>
            </Paper>
          </Grid>

          {/* Featured Course 2 */}
          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={{ padding: "1rem", height: "100%" }}> {/* CourseCard Component */}
              <Typography variant="h6" gutterBottom>
                Course Title
              </Typography>
              <Typography variant="body2" gutterBottom>
                Instructor Name
              </Typography>
              <Typography variant="body1" sx={{ marginTop: "1rem" }}>
                Course Description
              </Typography>
              <Button variant="outlined" color="primary" size="small" sx={{ marginTop: "1rem" }}>
                Learn More
              </Button>
            </Paper>
          </Grid>

          {/* Featured Course 3 */}
          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={{ padding: "1rem", height: "100%" }}> {/* CourseCard Component */}
              <Typography variant="h6" gutterBottom>
                Course Title
              </Typography>
              <Typography variant="body2" gutterBottom>
                Instructor Name
              </Typography>
              <Typography variant="body1" sx={{ marginTop: "1rem" }}>
                Course Description
              </Typography>
              <Button variant="outlined" color="primary" size="small" sx={{ marginTop: "1rem" }}>
                Learn More
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Benefits Section */}
      <Container
        maxWidth="lg"
        sx={{ marginTop: "4rem", marginBottom: "2rem", padding: "2rem", backgroundColor: "#f0f0f0" }}
      >
        <Typography variant="h4" component="h2" align="center" gutterBottom>
          Why Choose Us?
        </Typography>
        <Grid container spacing={3} sx={{ marginTop: "2rem" }}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" align="center">
              Expert Instructors
            </Typography>
            <Typography variant="body1" align="center" sx={{ marginTop: "1rem" }}>
              Learn from industry experts with real-world experience.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" align="center">
              Diverse Courses
            </Typography>
            <Typography variant="body1" align="center" sx={{ marginTop: "1rem" }}>
              Choose from a wide range of courses across various topics.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" align="center">
              Flexibility
            </Typography>
            <Typography variant="body1" align="center" sx={{ marginTop: "1rem" }}>
              Learn at your own pace, anytime, anywhere.
            </Typography>
          </Grid>
        </Grid>
      </Container>

      {/* Call-to-Action Section */}
      {isLoggedIn ? (
        // If the user is logged in, show a personalized welcome message
        <Container
          maxWidth="lg"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#007bff",
            color: "#fff",
            padding: "4rem 0",
          }}
        >
          <Typography variant="h4" component="h2" align="center" gutterBottom>
            Welcome Back, [User&apos;s Name]!
          </Typography>
          <Typography variant="body1" align="center" gutterBottom>
            Explore new courses or continue your learning journey.
          </Typography>
          <Button variant="contained" color="primary" size="large" sx={{ marginTop: "2rem" }}>
            Continue Learning
          </Button>
        </Container>
      ) : (
        // If the user is not logged in, show the regular call-to-action to sign up
        <Container
          maxWidth="lg"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#007bff",
            color: "#fff",
            padding: "4rem 0",
          }}
        >
          <Typography variant="h4" component="h2" align="center" gutterBottom>
            Ready to Get Started?
          </Typography>
          <Typography variant="body1" align="center" gutterBottom>
            Join thousands of learners today and unlock your full potential.
          </Typography>
          <Button variant="contained" color="primary" size="large" sx={{ marginTop: "2rem" }}>
            Sign Up Now
          </Button>
        </Container>
      )}
    </div>
  );
}

export default Landing;
