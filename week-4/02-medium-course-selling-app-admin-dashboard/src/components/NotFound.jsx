import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div>
    <div style={{
    display: "flex",
    justifyContent: "center",
    marginTop: "1vh",
    color: "white"
    }}>
    <h1>404 - Not Found!</h1>
  </div>
  <div style={{
    display: "flex",
    justifyContent: "center",
    marginTop: "1vh",
    }}>
  <Link to="/">Go Home</Link>
  </div>
  </div>
);

export default NotFound;