import React from 'react'
import { useNavigate } from 'react-router-dom'
import '../CSS/navbar.css'
export default function Navbar() {
    const navigate = useNavigate();

    const handleLogOut = () =>{
      localStorage.removeItem("Token")
      navigate('/')
    }
  return (
    <div>
      <div className='navbar'>
      <div onClick={() => navigate('/')} className='navLogo'>
            Admin.Com
        </div>

        <div className='navItems'>

          {(localStorage.getItem("Token"))?
          <>
            <div onClick={() => navigate('/about')}className='navItem'>
            Create Course
        </div>
        <div onClick={() => navigate('/courses')}className='navItem'>
            All Courses
        </div>

        <div onClick={handleLogOut}className='navItem'>
            Logout
        </div>
        </>
          :
          <>
          <div onClick={() => navigate('/register')} className='navItem'>
                Register
            </div>
            <div onClick={() => navigate('/login')}className='navItem'>
                Login
            </div>
            
            </>}
         
          
            
        </div>
      </div>
    </div>
  )
}
