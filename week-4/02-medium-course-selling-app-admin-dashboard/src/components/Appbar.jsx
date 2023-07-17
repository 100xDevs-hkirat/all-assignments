import React, { useEffect, useState } from "react";
import "./style.css";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";

/// This is the landing page. You need to add a link to the login page here.
/// Maybe also check from the backend if the user is already logged in and then show them a logout button
/// Logging a user out is as simple as deleting the token from the local storage.
function Appbar() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3000/admin/me", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setUserName(data);
        setIsLoggedIn(true);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Coursera
          </Typography>
          {isLoggedIn ? (
            <Button
              color="inherit"
              onClick={() => {
                localStorage.setItem("token", "");
                setIsLoggedIn(false);
                navigate("/login");
              }}
            >
              Logout
            </Button>
          ) : (
            <div>
              <Button color="inherit" onClick={() => navigate("/register")}>
                Register
              </Button>
              <Button color="inherit" onClick={() => navigate("/login")}>
                Login
              </Button>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Appbar;
