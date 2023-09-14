import { TextField } from "@mui/material";

function Input(props) {
    return (
      <TextField
        fullWidth
        {...props}
        sx={{ "& .MuiInputBase-input": { height: "10px" }, marginY: 1 }}
      />
    );
}

export default Input;