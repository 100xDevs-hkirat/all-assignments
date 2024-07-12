import { Box, Card } from "@mui/material";
import { Button } from "@mui/material";
import { red } from "@mui/material/colors";
import React from "react";

function Todo(props) {
  return (
    <center>
      <Card variant="outlined" sx={{ maxWidth: 250, padding: 2, marginTop: 3 }}>
        Name : {props.name}
        <br></br>
        Details : {props.description}
        <Box marginTop={2} justifyContent={"center"}>
          <Button variant="contained" sx={{ padding: 1, fontSize: 10 }}>
            Done
          </Button>
          <Button
            variant="contained"
            sx={{
              padding: 1,
              fontSize: 10,
              marginLeft: 2,
              backgroundColor: red,
            }}
            onClick={() => {
              props.deleteAccount(props.id);
            }}
          >
            Delete
          </Button>
        </Box>
      </Card>
    </center>
  );
}

export default Todo;
