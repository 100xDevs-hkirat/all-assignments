import { useContext , useState} from "react"
import {AuthContext} from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
function SignUp() {

    const navigate = useNavigate();
    const authContext = useContext(AuthContext)

    const [data , setData ] = useState({
        name:'',
        email:'',
        password: '',
        passwordConfirm: '',
        role: 'User'
    })
    const handleChange = (e) => {
        const { name, value } = e.target;
        setData( (prev) => ({ ...prev, [name]: value}));
    };

    const handleSubmit = () => {
        authContext.signup({
           name: data.name,
           email: data.email,
           password: data.password,
           passwordConfirm: data.passwordConfirm,
           role: data.role
        }).then(() => {
            console.log("succes fom signup");
        })
        navigate("/courses")

        setData({ name: '', email:'', password:'', passwordConfirm:'', role: 'user'});
    }


    return (

        <div className="container">
        <div className="form">

            <h3>Create An Account</h3>

            <input type='text' name="name" placeholder="name" value={data.name} onChange={handleChange}/>
            
            <input type='email' name="email" placeholder="email" value={data.email} onChange={handleChange}/>
            
            <input type='password' name="password" placeholder="password" value={data.password} onChange={handleChange}/>
            
            <input type='password' name="passwordConfirm" placeholder="Confirm Password" value={data.passwordConfirm} onChange={handleChange}/>

            <div className="radiobtn">
                <label>Choose your role </label>

                <label><input type="radio" name="role" value="User" checked={data.role === 'User'} onChange={handleChange}/> User</label>

                <label><input type="radio" name="role" value="Admin" checked={data.role === 'Admin'} onChange={handleChange}/> Admin</label>
            </div>
            <button onClick={handleSubmit}>Signup</button>

        </div>
        </div>
    )
}

export default SignUp
