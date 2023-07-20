"@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { isLoggedInState } from "./LoginPage";
import { Main, openState } from "./AppNavBar";
import Typography from "@mui/material/Typography";

import "../index.css";

function LandingPage() {
  const [isLoggedIn] = useRecoilState(isLoggedInState);
  const [open] = useRecoilState(openState);
  const navigate = useNavigate();
  return (
    <Main open={open}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          flex: "1",
          gap: "50px",
          height: "100vh",
          marginLeft: "400px",
          marginRight: "200px",
          marginTop: "200px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "50px",
            flex: "1",
          }}
        >
          <Typography
            variant="h2"
            component="div"
            style={{ fontWeight: "500" }}
          >
            Become the{" "}
            <span style={{ color: "#bc1c44" }}>software engineer</span> that
            companies love to hire
          </Typography>
          <Typography variant="h6" component="div">
            All the coding courses that you need to excel in one place.
          </Typography>

          <Button
            variant="contained"
            style={{
              backgroundColor: "#bc1c44",
              padding: "10px 20px",
              fontWeight: "700",
              fontSize: "1rem",
              borderRadius: "50px",
              width: "180px",
            }}
            onClick={() => navigate(isLoggedIn ? "/courses" : "/login")}
          >
            View Courses
          </Button>
        </div>
        <div>
          <img
            src="https://opensource.com/sites/default/files/lead-images/browser_web_internet_website.png"
            alt=""
            className="responsive-image"
          />
        </div>
      </div>
    </Main>
  );
}

export default LandingPage;
