import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";

function NaveBar() {
    const isLoggedIn = localStorage.getItem("userToken");
    const onLogOut = () => {
      localStorage.removeItem("userToken");
      window.location.href = window.location.origin;
    };
    return (
      <AppBar position="static" sx={{ marginBottom: 5 }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            COURSES
          </Typography>
          {
            isLoggedIn && (
              <Link variant="button" underline="none" color='inherit' href="/courses/purchased">
                Purchased-Courses
              </Link>
            )
          }
          {isLoggedIn && (
            <Button onClick={onLogOut} color="inherit">
              LogOut
            </Button>
          )}
          {!isLoggedIn && (
            <Button color="inherit">
              <Link underline="none" color="inherit" href="/register">
                Register
              </Link>
            </Button>
          )}
          {!isLoggedIn && (
            <Button color="inherit">
              <Link underline="none" color="inherit" href="/login">
                Login
              </Link>
            </Button>
          )}
        </Toolbar>
      </AppBar>
    );
  }
  
  export default NaveBar;