import { Link } from "react-router-dom";
import "./Register.css";

function Login() {
  return (
    <div className="container">
      <h1>Login</h1>
      <form>
        <label htmlFor="username">Username:</label>
        <input type="text" id="username" name="username" />

        <label htmlFor="password">Password:</label>
        <input type="password" id="password" name="password" />

        <button type="submit">Login</button>
      </form>
      <p>
        Create an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}

export default Login;
