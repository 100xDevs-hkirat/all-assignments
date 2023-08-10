import { useState } from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  const [authToken, setAuthToken] = useState(
    localStorage.getItem("token" || "")
  );

  function logOut() {
    setAuthToken("");
    localStorage.removeItem("token");
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ margin: "auto", textAlign: "center", marginBottom: "10px" }}>
        Welcome to learners paradise!
      </h1>
      <br />
      <br />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link to="/courses">All Courses</Link>
        <br />
        <Link to="/courses/purchased">Purchased Courses</Link>
        <br />
        <LoginStatus token={authToken} logout={logOut} />
      </div>
    </div>
  );
};

function LoginStatus(props) {
  // eslint-disable-next-line react/prop-types
  const { token, logout } = props;
  if (!token) {
    return (
      <>
        <Link to="/login">Login</Link>
        <br />
        <Link to="/signup">SignUp</Link>
      </>
    );
  } else return <button onClick={logout}>Logout</button>;
}

export default LandingPage;
