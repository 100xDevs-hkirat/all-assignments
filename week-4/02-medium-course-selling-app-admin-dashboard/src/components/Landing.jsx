import React from "react";
import { Box } from "@mui/material";
import NaveBar from "./NavBar";

/// This is the landing page. You need to add a link to the login page here.
/// Maybe also check from the backend if the user is already logged in and then show them a logout button
/// Logging a user out is as simple as deleting the token from the local storage.
function Landing() {
  return (
    <Box>
      <NaveBar/>
      <h1 style={{margin : 10}}>Welcome to course selling website!</h1>
    </Box>
  );
}



export default Landing;
