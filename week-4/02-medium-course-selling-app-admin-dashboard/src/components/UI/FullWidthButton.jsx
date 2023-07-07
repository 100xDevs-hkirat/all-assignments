import { Button } from "@mui/material";

function FullWidthButton(props) {
  return (
    <Button fullWidth variant="contained" {...props} sx={{ marginY: 1 }}>
      {props.children}
    </Button>
  );
}

export default FullWidthButton;