import { useNavigate } from "react-router-dom";
import { Button, Typography } from "@mui/material";

function Appbar() {
  const navigate = useNavigate();
  return (
    <div
      style={{ display: "flex", justifyContent: "space-between", padding: 4 }}
    >
      <div>
        <Typography>Coursera</Typography>
      </div>
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
    </div>
  );
}

export default Appbar;
