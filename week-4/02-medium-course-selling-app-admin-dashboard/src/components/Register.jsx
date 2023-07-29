import React from "react";
import { CssVarsProvider } from "@mui/joy/styles";
import Sheet from "@mui/joy/sheet";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";

/// File is incomplete. You need to add input boxes to take input for users to register.
function Register() {
  const navigate = useNavigate();
  const [userData, setUserData] = React.useState({});
  const handleRegistration = () => {
    fetch("http://localhost:3000/admin/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.token) {
          localStorage.setItem("token", data.token);
          alert("logged in successfully");
          navigate("/courses");
        }
      });
  };
  return (
    <CssVarsProvider>
      <Sheet
        sx={{
          width: 600,
          mx: "auto", // margin left & right
          my: 4, // margin top & bottom
          py: 3, // padding top & bottom
          px: 2, // padding left & right
          display: "flex",
          flexDirection: "row",
          gap: 2,
          borderRadius: "sm",
          boxShadow: "md",
          justifyContent: "center",
        }}
      >
        <div>
          <Typography variant="h1" color="initial">
            Register to the website
          </Typography>
          <br />
          Username:-{" "}
          <input
            type={"text"}
            onChange={(e) =>
              setUserData((curr) => {
                return { ...curr, username: e.target.value };
              })
            }
          />{" "}
          <br />
          Password:-{" "}
          <input
            type={"text"}
            onChange={(e) =>
              setUserData((curr) => {
                return { ...curr, password: e.target.value };
              })
            }
          />{" "}
          <br />
          <button onClick={() => handleRegistration()}>Register</button>
          Already a user? <a href="/login">Login</a>
        </div>
      </Sheet>
    </CssVarsProvider>
  );
}

export default Register;
