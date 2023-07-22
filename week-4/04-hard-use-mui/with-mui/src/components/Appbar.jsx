import * as React from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
// import { Link } from 'react-router-dom'
import { useNavigate } from "react-router-dom";
// import useContext from 'react'
import SnackbarAlert from "./SnackbarAlert.jsx";
import LoginContext from "./LoginContext";

const drawerWidth = 240;

function Appbar(props) {
// function Appbar() {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  // const {token, setToken } = props;
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn } = React.useContext(LoginContext);
  

  const navHome = () => {
    navigate("/");
  };
  const navCourses = () => {
    navigate("/courses");
  };
  const navAbout = () => {
    navigate("/about");
  };
  const navLogin = () => {
    navigate("/login");
  };
  const navRegister = () => {
    navigate("/register");
  };
  const navPurchased = () => {
    navigate("/courses/purchased");
  };
  const navLogout = () => {
    localStorage.setItem("token", "");
    setIsLoggedIn(false);
    navigate("/");
  };

  const navItems = [
    { name: "Home", nav: navHome },
    { name: "About", nav: navAbout },
    { name: "courses", nav: navCourses },
    { name: "Register", nav: navRegister },
    { name: "Login", nav: navLogin },
    { name: "Logout", nav: navLogout },
    { name: "Purchased", nav: navPurchased },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        CourseX
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.name} disablePadding>
            <ListItemButton sx={{ textAlign: "center" }}>
              <ListItemText primary={item.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar component="nav">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
          >
            CourseX
          </Typography>
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            {!isLoggedIn? (
              <>
                <Button key={"login"} onClick={navLogin} sx={{ color: "#fff" }}>
                  {"login"}
                </Button>
                <Button
                  key={"register"}
                  onClick={navRegister}
                  sx={{ color: "#fff" }}
                >
                  {"register"}
                </Button>
              </>
            ): (
              <>
                <Button key={"home"} onClick={navHome} sx={{ color: "#fff" }}>
                  {"home"}
                </Button>
                <Button key={"about"} onClick={navAbout} sx={{ color: "#fff" }}>
                  {"about"}
                </Button>
                <Button
                  key={"courses"}
                  onClick={navCourses}
                  sx={{ color: "#fff" }}
                >
                  {"courses"}
                </Button>
                <Button
                  key={"purchased"}
                  onClick={navPurchased}
                  sx={{ color: "#fff" }}
                >
                  {"purchased"}
                </Button>
                <Button
                  key={"logout"}
                  onClick={navLogout}
                  sx={{ color: "#fff" }}
                >
                  {"logout"}
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <Box component="nav">
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      <SnackbarAlert  />
    </Box>
  );
}

Appbar.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default Appbar;
