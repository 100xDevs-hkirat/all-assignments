import React from "react";
import { Link } from "react-router-dom";
import { Typography, Button, Grid } from "@mui/material";

// Custon auth hook
function useAuthToken() {
  const [authToken, setAuthToken] = React.useState(
    localStorage.getItem("token") || ""
  );

  function updateAuthToken(token) {
    setAuthToken(token);
    if (!token) {
      localStorage.removeItem("token");
    } else {
      localStorage.setItem("token", token);
    }
  }
  return [authToken, updateAuthToken];
}

// Landing page component
function Landing() {
  const [authToken, setAuthToken] = useAuthToken();

  function logout() {
    setAuthToken("");
  }

  return (
    <Grid container direction="column" alignItems="center" spacing={2}>
      <Grid item>
        <Typography variant="h4">Landing Page</Typography>
      </Grid>
      {!authToken && (
        <>
          <Grid item>
            <Button
              component={Link}
              to="/login"
              variant="contained"
              color="primary"
            >
              Login
            </Button>
          </Grid>
          <Grid item>
            <Button
              component={Link}
              to="/register"
              variant="outlined"
              color="primary"
            >
              Register
            </Button>
          </Grid>
        </>
      )}
      {authToken && (
        <>
          <Grid item>
            <Button onClick={logout} variant="contained" color="primary">
              Logout
            </Button>
          </Grid>
          <Grid item>
            <Typography variant="body1">
              <Link to="/courses">Courses</Link>
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="body1">
              <Link to="/courses/purchased">Purchased Courses</Link>
            </Typography>
          </Grid>
        </>
      )}
    </Grid>
  );
}

export default Landing;
