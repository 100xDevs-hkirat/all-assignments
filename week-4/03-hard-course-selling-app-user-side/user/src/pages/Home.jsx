import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div>
        <h1>Welcome to the Course selling website</h1>
      </div>
      <div>
        <button onClick={() => navigate("/signup")}>Get started</button>
        <button onClick={() => navigate("/login")}>Login</button>
      </div>
    </div>
  );
};

export default Home;
