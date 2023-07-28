import { useForm, FieldValues } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  username: z.string().email({ message: "Please enter a valid email." }),
  password: z
    .string()
    .min(5, { message: "Password must contain at least 5 charecters" }),
});

type FormData = z.infer<typeof schema>;

const Signup = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  //   const [username, setUsername] = useState("");
  //   const [password, setPassword] = useState("");

  const handleSignup = async (formData: FieldValues) => {
    const response = await fetch("http://localhost:3000/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    // Todo: Create a type for the response that you get back from the server
    const data = await response.json();
    if (data.token) {
      localStorage.setItem("token", data.token);
      window.location = "/todos";
    } else {
      alert("Error while signing up");
    }
  };
  //const onSubmit = (data: FieldValues) => handleSignup;
  return (
    <div style={{ justifyContent: "center", display: "flex", width: "100%" }}>
      <div>
        <h2>Signup</h2>
        <form onSubmit={handleSubmit(handleSignup)}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              {...register("username")}
              id="username"
              className="form-control"
              type="text"
              //   value={username}
              //   onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
            />
            {errors.username && (
              <p className="text-danger">{errors.username.message}</p>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              {...register("password")}
              id="password"
              className="form-control"
              type="password"
              //   value={password}
              //   onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
            {errors.password && (
              <p className="text-danger">{errors.password.message}</p>
            )}
          </div>
          Already signed up? <Link to="/login">Login</Link>
          <button className="btn btn-primary" type="submit">
            Signup
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
