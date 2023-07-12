import { Link, NavLink } from "react-router-dom";
import logo from './../assets/logo.svg'
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import account from '../assets/account.svg'
function Header() {

  const {state} =  useContext(AuthContext); 
  const authContext = useContext(AuthContext);
  const {user,isAuthenticated}  = state ;
        //const name = user.name;


        function logoutall() {
          authContext.logout();
        }
return (
    <header >
      <div >
        <img className="logo" src={logo} alt="logo.img" />
      </div>

      <nav>
        <ul>
          <li>
            <NavLink to="/">Home</NavLink>
          </li>
          <li>
            <NavLink to="courses">Courses</NavLink>
          </li>
          {isAuthenticated && user.role === 'User' && <li><NavLink to="/buyedcourse "> Buyed courses</NavLink></li>}
          {isAuthenticated && user.role === 'Admin' && <li><NavLink to="/createcourse "> Create Course</NavLink></li>}

        </ul>

      <div  className="role">

        { 
        isAuthenticated ? (<>
          <div className="username"> <span>Welcome, {user.name.split(' ')[0]  }</span><img src={account}  alt="" /></div>
        </>) :  <>  
          <Link to="login"><span className="login btn">Login</span></Link>
          <Link to="signup"><span className="signup btn">Sign Up</span></Link>
          </>
         
        }
          {isAuthenticated &&<div className="btn" onClick={logoutall}><span>Logout</span></div>}
        
        </div>

        
      </nav>

    </header>
  );
}

export default Header;
