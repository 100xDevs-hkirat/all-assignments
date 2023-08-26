import {useEffect, useState} from 'react';
import reactLogo from '../assets/react.svg'
import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import axios from 'axios'


const Navbar = () => {
    const [isLogged, setIsLogged] = useState(false)

    useEffect(() => {
        const token = localStorage.getItem('token')
        const fetchData = async () => {
            try {
              const response = await axios.get('http://localhost:3000/admin/me/', {
                headers: {
                  Authorization: `Bearer ${token}`,
                  // Other headers if needed
                },
              });
              console.log(response)
              setIsLogged(true);
            } catch (error) {
              console.error('Error fetching data:', error);
            }
          };
      
          fetchData();
    }, [])

    const logout = () => {
        localStorage.removeItem('token')
    }

    return (
        <AppBar position="fixed" className='nav-color'>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 1 }}
          >
           <Link to={'/'}>
           <img src={reactLogo} className="logo react" alt="React logo" />
           </Link>
          </IconButton>
          <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
            LearnIt
          </Typography>
          {!isLogged ? <div><Link to={'/login'}><Button style={{marginRight: '15px'}} variant='contained' color="primary">Login</Button></Link>
          <Link to={'/register'}><Button variant='contained' color="primary">SignUp</Button></Link></div>
        : <div><Link to={'/courses'}><Button style={{marginRight: '15px', color: "white"}} color="primary">Courses</Button></Link><Link to={'/createCourse'}><Button style={{marginRight: '15px',color:"white"}} color="primary">Add Course</Button></Link>
        <Link to={'/'}><Button onClick={logout} variant='contained' color="primary">Logout</Button></Link></div> }
        </Toolbar>
      </AppBar>
    );
}

export default Navbar;