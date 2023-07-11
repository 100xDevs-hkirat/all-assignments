import React from "react";
import { SnackbarProvider as MuiSnackbarProvider } from "@mui/material/Snackbar";
import { SnackbarContext } from "./SnackbarContext";
import PropTypes from 'prop-types';

const SnackbarProvider = ({ children }) => {
  const { snackbarState, closeSnackbar } = React.useContext(SnackbarContext);

  const handleSnackbarClose = () => {
    closeSnackbar();
  };

  return (
    <MuiSnackbarProvider
      open={snackbarState.open}
      autoHideDuration={3000}
      onClose={handleSnackbarClose}
      message={snackbarState.message}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      severity={snackbarState.severity}
    >
      {children}
    </MuiSnackbarProvider>
  );
};

export default SnackbarProvider;

SnackbarProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
};