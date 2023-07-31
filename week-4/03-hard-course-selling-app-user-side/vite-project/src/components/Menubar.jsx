import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import useAuthManager from "../auth/useAuthManager";
import { useNavigate } from "react-router";

const Menubar = () => {
  const isAuthenticated = useAuthManager();
  const navigate = useNavigate();
  const [state, setState] = useState();
  const handleInOut = () => {
    if (isAuthenticated) {
      localStorage.setItem("token", "");
    }
    navigate("/login");
  };
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        backgroundColor: "blanchedalmond",
      }}
    >
      <Typography
        variant="h3"
        color="initial"
        onClick={() => {
          navigate("/");
        }}
      >
        Courserraa
      </Typography>
      <div style={{ display: "flex", alignSelf: "center" }}>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => {
            handleInOut();
          }}
        >
          {isAuthenticated ? "LogOut" : "Login"}
        </Button>
      </div>
    </div>
  );
};

export default Menubar;
