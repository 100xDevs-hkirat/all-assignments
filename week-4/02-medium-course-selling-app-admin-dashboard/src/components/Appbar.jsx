import { Typography, Button, Card } from '@mui/material'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Appbar = () => {
  const [user, setUser] = useState('')
  const navigate = useNavigate()
  useEffect(() => {
    axios.get('http://localhost:3000/admin/me',{
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
    }
    }).then((res)=>{
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
    <div style={{ display: 'flex'}}>
      <Card style={{ padding: 10, width: '100vw', borderRadius: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <Typography variant="h6">CoursePro</Typography>
          </div>
          {user ? (
            <div
              style={{
                backgroundColor: '#28bced',
                color: 'white',
                paddingInline: 14,
                borderRadius: 35,
                paddingTop: 5,
              }}
            >
              {user}
            </div>
          ) : (
            <div>
              <Button
                variant="outlined"
                style={{ marginRight: 5 }}
                onClick={() => {
                  navigate('/register')
                }}
              >
                Signup
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  navigate('/login')
                }}
              >
                Login
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

export default Appbar
