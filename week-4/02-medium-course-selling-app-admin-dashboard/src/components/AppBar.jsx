import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import "./AppBar.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

// import { makeStyles } from '@material-ui/core/styles';

const AppBar = () => {
  const [userEmail, setUserEmail] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const navigator = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:3000/admin/me", {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });
        console.log(response);
        console.log(response.data);
        setUserEmail(response.data.username);
        setIsAuthorized(false);
      } catch (error) {
        console.log(error);
        setIsAuthorized(true);
        setUserEmail(null);
      }
    };

    getUser();
  }, []);

  return (
    <div>
      {userEmail && (
        <div className="nav">
          <div>
            <Typography
              style={{ cursor: "pointer" }}
              variant="h5"
              className="log"
              onClick={() => navigator("/")}
            >
              Courses_a
            </Typography>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <div>
              <Button
                sx={{
                  width: 100,
                }}
                className="btn"
                variant="contained"
                onClick={() => {
                  // navigator('/');
                  localStorage.removeItem("token");
                  window.location = "/";
                }}
              >
                log out
              </Button>
            </div>
          </div>
        </div>
      )}
      {isAuthorized && (
        <div className="nav">
          <div>
            <Typography
              style={{ cursor: "pointer" }}
              variant="h5"
              className="log"
              onClick={() => navigator("/")}
            >
              Courses_a
            </Typography>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <div>
              <Button
                sx={{
                  width: 100,
                }}
                className="btn"
                variant="contained"
                onClick={() => navigator("/login")}
              >
                log in
              </Button>
            </div>
            <div>
              <Button
                sx={{
                  width: 100,
                }}
                className="btn"
                variant="contained"
                onClick={() => navigator("/register")}
              >
                sign up
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppBar;
