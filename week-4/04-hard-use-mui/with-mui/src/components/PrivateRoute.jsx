import React from "react";
import { Navigate } from "react-router-dom";
import LoginContext from "./LoginContext.jsx";
import { PropTypes } from "prop-types";

const PrivateRoute = ({ 
  Component }) => {
  const { isLoggedIn } = React.useContext(LoginContext);

  return isLoggedIn ? <Component /> : <Navigate to="/login" />;
};

PrivateRoute.propTypes = {
  Component: PropTypes.elementType,
};

export default PrivateRoute;
