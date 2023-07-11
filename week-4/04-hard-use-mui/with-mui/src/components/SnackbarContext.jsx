import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

export const SnackbarContext = createContext();

export const SnackbarProvider = ({ children }) => {
  const [snackbarState, setSnackbarState] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    let timer;

    if (snackbarState.open) {
      timer = setTimeout(() => {
        closeSnackbar();
      }, 3000);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [snackbarState.open]);

  const showSnackbar = (message, severity) => {
    setSnackbarState({
      open: true,
      message,
      severity,
    });
  };

  const closeSnackbar = () => {
    setSnackbarState((prevState) => ({
      ...prevState,
      open: false,
    }));
  };

  return (
    <SnackbarContext.Provider
      value={{ snackbarState, showSnackbar, closeSnackbar }}
    >
      {children}
    </SnackbarContext.Provider>
  );
};

SnackbarProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
};
