import { Card, Typography, Button } from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Sidebar = () => {
  const [user, setUser] = useState('')
  const navigate = useNavigate()
  useEffect(() => {
    axios
      .get('http://localhost:3000/admin/me', {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      })
      .then((res) => {
        setUser(res.data.username)
      })
    // fetch('http://localhost:3000/admin/me', {
    //   method: 'GET',
    //   headers: {
    //     'Content-type': 'application/json',
    //     Authorization: 'Bearer ' + localStorage.getItem('token'),
    //   },
    // }).then((res) => {
    //   res.json().then((data) => {
    //     console.log(data.username)
    //     setUser(data.username)
    //   })
    // })
  }, [])
  return (
    <div>
      <Card
        style={{
          width: 250,
          height: '100%',
          border: 'none',
          boxShadow: 'none',
          borderRadius: 0,
          backgroundColor: '#eeeeee',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', margin: 10 }}>
          <div>
            <Typography style={{ margin: 10 }}>Main Menu</Typography>
          </div>
          <div>
            <Button
              onClick={() => {
                navigate('/')
              }}
            >
              Home
            </Button>
          </div>
          <div>
            <Button
              onClick={() => {
                navigate('/courses')
              }}
            >
              Courses
            </Button>
          </div>
          {user ? (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div>
                <Button
                  onClick={() => {
                    navigate('/createcourse')
                  }}
                >
                  Add Courses
                </Button>
              </div>
              <div>
                <Button
                  onClick={() => {
                    localStorage.removeItem('token')
                    window.location='/'
                  }}
                >
                  Logout
                </Button>
              </div>
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </Card>
    </div>
  )
}

export default Sidebar
