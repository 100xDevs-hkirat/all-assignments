import { useNavigate } from "react-router-dom";
import { Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { URL } from "./constants";

function Appbar() {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const options = {
      method: "POST",
      headers: {
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };
    fetch(`${URL}/admin/me`, options)
      .then((res) => res.json())
      .then((data) => {
        if (data?.username) {
          setUserEmail(data.username);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <></>;
  }

  return (
    <div
      style={{ display: "flex", justifyContent: "space-between", padding: 4 }}
    >
      <div>
        <Typography>Coursera</Typography>
      </div>
      {userEmail ? (
        <div style={{ display: "flex" }}>
          {userEmail}
          <Button
            variant="contained"
            onClick={() => {
              localStorage.setItem("token", null);
              window.location = "/";
            }}
          >
            Logout
          </Button>
        </div>
      ) : (
        <div style={{ display: "flex" }}>
          <Button
            variant="contained"
            onClick={() => {
              navigate("/signup");
            }}
          >
            Sign up
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              navigate("/signin");
            }}
          >
            Sign in
          </Button>
        </div>
      )}
    </div>
  );
}

export default Appbar;
